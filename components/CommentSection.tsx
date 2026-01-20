'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
};

export default function CommentSection({ postId }: { postId: string }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const canPost = status === 'authenticated';
  const myUserId = (session?.user as any)?.id as string | undefined;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load comments');
        if (!cancelled) setComments(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load comments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const sorted = useMemo(() => comments, [comments]);

  async function submit() {
    if (!canPost) return;
    const text = content.trim();
    if (!text) return;

    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to post comment');

      setComments((prev) => [data as Comment, ...prev]);
      setContent('');
    } catch (e: any) {
      setError(e?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(id: string) {
    const ok = window.confirm('Delete this comment?');
    if (!ok) return;

    setError('');
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to delete comment');

      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete comment');
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Comments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        {canPost ? (
          <>
            <TextField
              label="Add a comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              disabled={submitting}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                variant="contained"
                onClick={submit}
                disabled={submitting || !content.trim()}
              >
                {submitting ? 'Posting...' : 'Post comment'}
              </Button>
            </Box>
          </>
        ) : (
          <Typography color="text.secondary">
            Please sign in to comment.
          </Typography>
        )}
      </Paper>

      {loading ? (
        <Typography color="text.secondary">Loading comments…</Typography>
      ) : sorted.length === 0 ? (
        <Typography color="text.secondary">No comments yet.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sorted.map((c) => {
            const isMine = myUserId && c.author.id === myUserId;
            return (
              <Paper key={c.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar src={c.author.avatar || undefined}>
                    {c.author.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {c.author.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(c.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  {isMine && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => deleteComment(c.id)}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{c.content}</Typography>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}


