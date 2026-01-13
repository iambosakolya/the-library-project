import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { convertToPlainObj } from '@/lib/utils';
import { Prisma } from '@/src/generated/prisma';

/**
 * GET /api/admin/requests
 * Query params:
 * - status: 'pending' | 'approved' | 'rejected' | 'all' (default: 'pending')
 * - type: 'club' | 'event' | 'all' (optional)
 * - search: string (optional)
 * - page: number (default: 1)
 * - limit: number (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ClubRequestWhereInput = {};

    if (status && status !== 'all') {
      where.status = {
        equals: status as 'pending' | 'approved' | 'rejected',
      };
    }

    if (type && type !== 'all') {
      where.type = {
        equals: type as 'club' | 'event',
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { purpose: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [requests, totalCount] = await Promise.all([
      prisma.clubRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
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
      }),
      prisma.clubRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: convertToPlainObj(requests),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    );
  }
}
