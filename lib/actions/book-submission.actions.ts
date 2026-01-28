'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { bookSubmissionSchema } from '../validators';
import { z } from 'zod';
import { auth } from '@/auth';

// Create a new book submission
export async function createBookSubmission(
  data: z.infer<typeof bookSubmissionSchema>,
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to submit a book',
      };
    }

    // Validate the input data
    const validatedData = bookSubmissionSchema.parse(data);

    // Check if a similar submission already exists (same title and author by same user)
    const existingSubmission = await prisma.bookSubmission.findFirst({
      where: {
        userId: session.user.id,
        title: validatedData.title,
        author: validatedData.author,
        status: {
          in: ['pending', 'approved'],
        },
      },
    });

    if (existingSubmission) {
      return {
        success: false,
        message:
          'You already have a pending or approved submission for this book',
      };
    }

    // Check if book already exists in catalog (by ISBN if provided)
    if (validatedData.isbn || validatedData.isbn13) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { name: validatedData.title, author: validatedData.author },
          ],
        },
      });

      if (existingProduct) {
        return {
          success: false,
          message: 'This book already exists in our catalog',
        };
      }
    }

    // Create the book submission
    const bookSubmission = await prisma.bookSubmission.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        author: validatedData.author,
        isbn: validatedData.isbn || null,
        isbn13: validatedData.isbn13 || null,
        publisher: validatedData.publisher || null,
        publishedDate: validatedData.publishedDate || null,
        description: validatedData.description,
        pageCount: validatedData.pageCount || null,
        language: validatedData.language || null,
        categories: validatedData.categories,
        coverImage: validatedData.coverImage || null,
        thumbnailImage: validatedData.thumbnailImage || null,
        previewLink: validatedData.previewLink || null,
        googleBooksId: validatedData.googleBooksId || null,
        status: 'pending',
      },
    });

    revalidatePath('/user/book-submissions');

    return {
      success: true,
      message: 'Book submission created successfully and is pending approval',
      data: convertToPlainObj(bookSubmission),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all book submissions for the current user
export async function getUserBookSubmissions({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected';
} = {}) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to view your submissions',
      };
    }

    const where = {
      userId: session.user.id,
      ...(status && { status }),
    };

    const [submissions, totalCount] = await Promise.all([
      prisma.bookSubmission.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookSubmission.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: convertToPlainObj(submissions),
      pagination: {
        page,
        limit,
        totalPages,
        totalCount,
      },
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get a single book submission by ID
export async function getBookSubmissionById(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to view this submission',
      };
    }

    const submission = await prisma.bookSubmission.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return {
        success: false,
        message: 'Book submission not found',
      };
    }

    // Check if user owns this submission or is admin
    if (
      submission.userId !== session.user.id &&
      session.user.role !== 'admin'
    ) {
      return {
        success: false,
        message: 'You do not have permission to view this submission',
      };
    }

    return {
      success: true,
      data: convertToPlainObj(submission),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update a book submission (for users to edit pending submissions)
export async function updateBookSubmission(
  id: string,
  data: z.infer<typeof bookSubmissionSchema>,
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to update a submission',
      };
    }

    const submission = await prisma.bookSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return {
        success: false,
        message: 'Book submission not found',
      };
    }

    if (submission.userId !== session.user.id) {
      return {
        success: false,
        message: 'You do not have permission to update this submission',
      };
    }

    if (submission.status !== 'pending') {
      return {
        success: false,
        message: 'You can only edit pending submissions',
      };
    }

    const validatedData = bookSubmissionSchema.parse(data);

    const updatedSubmission = await prisma.bookSubmission.update({
      where: { id },
      data: {
        title: validatedData.title,
        author: validatedData.author,
        isbn: validatedData.isbn || null,
        isbn13: validatedData.isbn13 || null,
        publisher: validatedData.publisher || null,
        publishedDate: validatedData.publishedDate || null,
        description: validatedData.description,
        pageCount: validatedData.pageCount || null,
        language: validatedData.language || null,
        categories: validatedData.categories,
        coverImage: validatedData.coverImage || null,
        thumbnailImage: validatedData.thumbnailImage || null,
        previewLink: validatedData.previewLink || null,
        googleBooksId: validatedData.googleBooksId || null,
      },
    });

    revalidatePath('/user/book-submissions');
    revalidatePath(`/user/book-submissions/${id}`);

    return {
      success: true,
      message: 'Book submission updated successfully',
      data: convertToPlainObj(updatedSubmission),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete a book submission (only pending ones)
export async function deleteBookSubmission(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: 'You must be signed in to delete a submission',
      };
    }

    const submission = await prisma.bookSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return {
        success: false,
        message: 'Book submission not found',
      };
    }

    if (submission.userId !== session.user.id) {
      return {
        success: false,
        message: 'You do not have permission to delete this submission',
      };
    }

    if (submission.status !== 'pending') {
      return {
        success: false,
        message: 'You can only delete pending submissions',
      };
    }

    await prisma.bookSubmission.delete({
      where: { id },
    });

    revalidatePath('/user/book-submissions');

    return {
      success: true,
      message: 'Book submission deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Search existing authors for autocomplete
export async function searchAuthors(query: string) {
  try {
    if (!query || query.length < 2) {
      return {
        success: true,
        data: [],
      };
    }

    // Search in both Product and BookSubmission tables
    const [productAuthors, submissionAuthors] = await Promise.all([
      prisma.product.findMany({
        where: {
          author: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          author: true,
        },
        distinct: ['author'],
        take: 5,
      }),
      prisma.bookSubmission.findMany({
        where: {
          author: {
            contains: query,
            mode: 'insensitive',
          },
          status: 'approved',
        },
        select: {
          author: true,
        },
        distinct: ['author'],
        take: 5,
      }),
    ]);

    // Combine and deduplicate
    const allAuthors = [
      ...productAuthors.map((p) => p.author),
      ...submissionAuthors.map((s) => s.author),
    ];
    const uniqueAuthors = Array.from(new Set(allAuthors));

    return {
      success: true,
      data: uniqueAuthors.slice(0, 10),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Search existing catalog for duplicate check
export async function searchCatalog(query: string) {
  try {
    if (!query || query.length < 3) {
      return {
        success: true,
        data: [],
      };
    }

    const books = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            author: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        author: true,
        images: true,
        slug: true,
      },
      take: 10,
    });

    return {
      success: true,
      data: convertToPlainObj(books),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
