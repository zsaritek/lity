import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional().nullable(),
  avatar: z.string().url('Avatar must be a valid URL').optional().nullable(),
  socialLink: z.string().url('Social link must be a valid URL').optional().nullable(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = updateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      const message =
        validationResult.error.issues[0]?.message ?? 'Invalid request';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { bio, avatar, socialLink } = validationResult.data;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(bio !== undefined && { bio: bio ?? null }),
        ...(avatar !== undefined && { avatar: avatar ?? null }),
        ...(socialLink !== undefined && { socialLink: socialLink ?? null }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        socialLink: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


