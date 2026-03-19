'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { reviewSchema, reviewReplySchema, reviewReportSchema } from '../validators';
import { z } from 'zod';
import { auth } from '@/auth';

// ─── Reviews ───────────────────────────────────────────────────────

export async function createReview(data: z.infer<typeof reviewSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to write a review',
      };
    }

    const validatedData = reviewSchema.parse(data);

    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: validatedData.productId,
        },
      },
    });

    if (existingReview) {
      return {
        success: false,
        message: 'You have already reviewed this book',
      };
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: validatedData.productId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    });

    await updateProductRating(validatedData.productId);

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: 'Review submitted successfully',
      data: convertToPlainObj(review),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateReview(
  reviewId: string,
  data: { rating: number; comment: string },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to edit a review',
      };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: { select: { slug: true } } },
    });

    if (!review) {
      return { success: false, message: 'Review not found' };
    }

    if (review.userId !== session.user.id) {
      return {
        success: false,
        message: 'You can only edit your own reviews',
      };
    }

    const partialSchema = reviewSchema.pick({ rating: true, comment: true });
    const validatedData = partialSchema.parse(data);

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
    });

    await updateProductRating(review.productId);

    revalidatePath(`/product/${review.product.slug}`);

    return {
      success: true,
      message: 'Review updated successfully',
      data: convertToPlainObj(updatedReview),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteReview(reviewId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to delete a review',
      };
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: { select: { slug: true } } },
    });

    if (!review) {
      return { success: false, message: 'Review not found' };
    }

    if (review.userId !== session.user.id) {
      return {
        success: false,
        message: 'You can only delete your own reviews',
      };
    }

    await prisma.review.delete({ where: { id: reviewId } });

    await updateProductRating(review.productId);

    revalidatePath(`/product/${review.product.slug}`);

    return { success: true, message: 'Review deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
            children: {
              include: {
                user: {
                  select: { id: true, name: true, image: true },
                },
                children: {
                  include: {
                    user: {
                      select: { id: true, name: true, image: true },
                    },
                  },
                  orderBy: { createdAt: 'asc' },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: convertToPlainObj(reviews),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getUserReviewForProduct(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true, data: null };
    }

    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return {
      success: true,
      data: review ? convertToPlainObj(review) : null,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

async function updateProductRating(productId: string) {
  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: stats._avg.rating ?? 0,
      numReviews: stats._count.rating,
    },
  });
}

// ─── Replies ───────────────────────────────────────────────────────

const MAX_REPLY_DEPTH = 3;

export async function createReply(data: z.infer<typeof reviewReplySchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to reply',
      };
    }

    const validatedData = reviewReplySchema.parse(data);

    const review = await prisma.review.findUnique({
      where: { id: validatedData.reviewId },
      include: { product: { select: { slug: true } } },
    });

    if (!review) {
      return { success: false, message: 'Review not found' };
    }

    let depth = 1;

    if (validatedData.parentId) {
      const parentReply = await prisma.reviewReply.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parentReply) {
        return { success: false, message: 'Parent reply not found' };
      }

      if (parentReply.reviewId !== validatedData.reviewId) {
        return { success: false, message: 'Parent reply does not belong to this review' };
      }

      depth = parentReply.depth + 1;

      if (depth > MAX_REPLY_DEPTH) {
        return {
          success: false,
          message: `Replies can only be nested up to ${MAX_REPLY_DEPTH} levels deep`,
        };
      }
    }

    const reply = await prisma.reviewReply.create({
      data: {
        userId: session.user.id,
        reviewId: validatedData.reviewId,
        parentId: validatedData.parentId || null,
        depth,
        comment: validatedData.comment,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    revalidatePath(`/product/${review.product.slug}`);

    return {
      success: true,
      message: 'Reply posted successfully',
      data: convertToPlainObj(reply),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateReply(
  replyId: string,
  data: { comment: string },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to edit a reply',
      };
    }

    const reply = await prisma.reviewReply.findUnique({
      where: { id: replyId },
      include: {
        review: {
          include: { product: { select: { slug: true } } },
        },
      },
    });

    if (!reply) {
      return { success: false, message: 'Reply not found' };
    }

    if (reply.userId !== session.user.id) {
      return {
        success: false,
        message: 'You can only edit your own replies',
      };
    }

    const commentSchema = reviewReplySchema.pick({ comment: true });
    const validatedData = commentSchema.parse(data);

    const updatedReply = await prisma.reviewReply.update({
      where: { id: replyId },
      data: { comment: validatedData.comment },
    });

    revalidatePath(`/product/${reply.review.product.slug}`);

    return {
      success: true,
      message: 'Reply updated successfully',
      data: convertToPlainObj(updatedReply),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteReply(replyId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to delete a reply',
      };
    }

    const reply = await prisma.reviewReply.findUnique({
      where: { id: replyId },
      include: {
        review: {
          include: { product: { select: { slug: true } } },
        },
      },
    });

    if (!reply) {
      return { success: false, message: 'Reply not found' };
    }

    if (reply.userId !== session.user.id) {
      return {
        success: false,
        message: 'You can only delete your own replies',
      };
    }

    await prisma.reviewReply.delete({ where: { id: replyId } });

    revalidatePath(`/product/${reply.review.product.slug}`);

    return { success: true, message: 'Reply deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// ─── Reports ──────────────────────────────────────────────────────

export async function reportContent(data: z.infer<typeof reviewReportSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'You must be signed in to report content',
      };
    }

    const validatedData = reviewReportSchema.parse(data);

    if (validatedData.reviewId) {
      const review = await prisma.review.findUnique({
        where: { id: validatedData.reviewId },
      });
      if (!review) {
        return { success: false, message: 'Review not found' };
      }
      if (review.userId === session.user.id) {
        return { success: false, message: 'You cannot report your own review' };
      }

      const existing = await prisma.reviewReport.findUnique({
        where: {
          userId_reviewId: {
            userId: session.user.id,
            reviewId: validatedData.reviewId,
          },
        },
      });
      if (existing) {
        return { success: false, message: 'You have already reported this review' };
      }
    }

    if (validatedData.replyId) {
      const reply = await prisma.reviewReply.findUnique({
        where: { id: validatedData.replyId },
      });
      if (!reply) {
        return { success: false, message: 'Reply not found' };
      }
      if (reply.userId === session.user.id) {
        return { success: false, message: 'You cannot report your own reply' };
      }

      const existing = await prisma.reviewReport.findUnique({
        where: {
          userId_replyId: {
            userId: session.user.id,
            replyId: validatedData.replyId,
          },
        },
      });
      if (existing) {
        return { success: false, message: 'You have already reported this reply' };
      }
    }

    await prisma.reviewReport.create({
      data: {
        userId: session.user.id,
        reviewId: validatedData.reviewId || null,
        replyId: validatedData.replyId || null,
        reason: validatedData.reason,
        description: validatedData.description || null,
      },
    });

    return {
      success: true,
      message: 'Report submitted. Our team will review it shortly.',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
