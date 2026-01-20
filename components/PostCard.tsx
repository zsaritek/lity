'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  CardActionArea,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      username: string;
      avatar: string | null;
    };
    tags: {
      id: string;
      name: string;
    }[];
    _count: {
      comments: number;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  // Get excerpt (first 150 characters)
  const excerpt = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={() => router.push(`/post/${post.slug}`)} sx={{ flexGrow: 1 }}>
        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              minHeight: '3.2em', // keep titles aligned across cards
            }}
          >
            {post.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar
              src={post.author.avatar || undefined}
              sx={{ width: 24, height: 24 }}
            >
              {post.author.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {post.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              •
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
              minHeight: '4.8em', // align excerpts across cards
            }}
          >
            {excerpt}
          </Typography>

          {/* Reserve consistent space so cards align even when some have 0 tags */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1, minHeight: 30 }}>
            {post.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag.id}
                label={`#${tag.name}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
            {post._count.comments} {post._count.comments === 1 ? 'comment' : 'comments'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
