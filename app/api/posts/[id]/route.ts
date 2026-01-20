import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import slugify from 'slugify';

const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(10).optional(),
  tags: z.array(z.string()).max(5).optional(),
  published: z.boolean().optional(),
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

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({
      where: { id },
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
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = updatePostSchema.safeParse(body);

    if (!validationResult.success) {
      const message =
        validationResult.error.issues[0]?.message ?? 'Invalid request';
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    // Check if post exists and user owns it
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingPost.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, content, tags, published } = validationResult.data;

    // Generate new slug if title changed
    let slug = existingPost.slug;
    if (title && title !== existingPost.title) {
      slug = slugify(title, { lower: true, strict: true });
      const slugExists = await prisma.post.findUnique({ where: { slug } });
      if (slugExists && slugExists.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Handle tags if provided
    let tagOperations = {};
    if (tags) {
      const normalizedTags = normalizeTags(tags);
      const tagObjects = await Promise.all(
        normalizedTags.map((name) =>
          prisma.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          })
        )
      );

      tagOperations = {
        set: [], // Disconnect all existing tags
        connect: tagObjects.map((tag) => ({ id: tag.id })),
      };
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(content && { content }),
        ...(published !== undefined && { published }),
        ...(tags && { tags: tagOperations }),
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

    return NextResponse.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.authorId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
