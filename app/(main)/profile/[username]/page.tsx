import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import PostCard from '@/components/PostCard';
import ProfileEditForm from '@/components/ProfileEditForm';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (!username) notFound();

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        where: { published: true },
        include: {
          author: { select: { id: true, username: true, avatar: true } },
          tags: true,
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) notFound();

  const isOwnProfile = Boolean(session?.user && session.user.id === user.id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
        <Avatar
          src={user.avatar || undefined}
          sx={{ width: 96, height: 96, bgcolor: 'primary.main' }}
        >
          {user.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {user.username}
          </Typography>
          {user.bio && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {user.bio}
            </Typography>
          )}
          {user.socialLink && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              <Link href={user.socialLink} target="_blank" rel="noreferrer">
                {user.socialLink}
              </Link>
            </Typography>
          )}
        </Box>
      </Box>

      {isOwnProfile && (
        <>
          <ProfileEditForm
            initialBio={user.bio}
            initialAvatar={user.avatar}
            initialSocialLink={user.socialLink}
          />
          <Divider sx={{ my: 4 }} />
        </>
      )}

      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Posts
      </Typography>

      {user.posts.length === 0 ? (
        <Typography color="text.secondary">No published posts yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {user.posts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <PostCard post={post as any} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}


