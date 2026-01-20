import { Container, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import HomeFilters from '@/components/HomeFilters';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; tag?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const search = typeof sp.search === 'string' ? sp.search.trim() : '';
  const tag = typeof sp.tag === 'string' ? sp.tag.trim().toLowerCase() : '';

  const tags = await prisma.tag.findMany({
    select: { name: true },
    orderBy: { name: 'asc' },
    take: 100,
  });

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(search && { title: { contains: search } }),
      ...(tag && { tags: { some: { name: tag } } }),
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Latest Posts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover stories, thinking, and expertise from writers on any topic.
        </Typography>
      </Box>

      <HomeFilters tags={tags.map((t) => t.name)} />

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No posts yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Be the first to share your thoughts!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
