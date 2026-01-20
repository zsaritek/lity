import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import slugify from 'slugify';

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(5).optional().default([]),
  published: z.boolean().optional().default(false),
});

function normalizeTags(input: string[]) {
  return Array.from(
    new Set(
      input
        .map((t) => t.trim().replace(/^#+/, '').toLowerCase())
        .filter(Boolean)
        .slice(0, 5)
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = createPostSchema.safeParse(body);

    if (!validationResult.success) {
      const message =
        validationResult.error.issues[0]?.message ?? 'Invalid request';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    const { title, content, tags, published } = validationResult.data;
    const normalizedTags = normalizeTags(tags);

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    const existingPost = await prisma.post.findUnique({ where: { slug } });

    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Handle tags - create or connect existing tags
    const tagObjects = await Promise.all(
      normalizedTags.map((name) =>
        prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        })
      )
    );

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published,
        authorId: (session.user as any).id,
        tags: {
          connect: tagObjects.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const tag = searchParams.get('tag');

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...(search && {
          title: {
            contains: search,
          },
        }),
        ...(tag && {
          tags: {
            some: {
              name: tag.toLowerCase(),
            },
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
