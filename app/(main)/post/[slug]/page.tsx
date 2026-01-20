import { notFound } from 'next/navigation';
import { Container, Typography, Box, Chip, Avatar, Paper, Button } from '@mui/material';
import { prisma } from '@/lib/prisma';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      tags: true,
    },
  });

  const isAuthor = Boolean(session?.user && (session.user as any).id === post?.authorId);

  if (!post || (!post.published && !isAuthor)) {
    notFound();
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {post.title}
            </Typography>
            {!post.published && (
              <Chip
                label="Draft"
                color="warning"
                size="small"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
          </Box>

          {isAuthor && (
            <Link href={`/editor/${post.id}`} style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="small"
                sx={{ flexShrink: 0, mt: 0.5 }}
              >
                Edit
              </Button>
            </Link>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar src={post.author.avatar || undefined}>
            {post.author.username?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {post.author.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Box>

        {post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {post.tags.map((tag) => (
              <Chip key={tag.id} label={`#${tag.name}`} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        <Box
          sx={{
            '& h1': { fontSize: '2rem', fontWeight: 700, mt: 3, mb: 2 },
            '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
            '& h3': { fontSize: '1.25rem', fontWeight: 600, mt: 2, mb: 1 },
            '& p': { mb: 2, lineHeight: 1.7 },
            '& code': {
              backgroundColor: '#f5f5f5',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.875em',
            },
            '& pre': {
              backgroundColor: '#1e1e1e',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
              mb: 2,
            },
            '& pre code': {
              backgroundColor: 'transparent',
              padding: 0,
              color: '#fff',
            },
            '& ul, & ol': { mb: 2, pl: 3 },
            '& li': { mb: 1 },
            '& blockquote': {
              borderLeft: '4px solid #2563eb',
              pl: 2,
              py: 1,
              my: 2,
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& a': { color: 'primary.main', textDecoration: 'underline' },
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </Box>

        {post.published && <CommentSection postId={post.id} />}
      </Paper>
    </Container>
  );
}
