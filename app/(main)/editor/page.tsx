'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  Chip,
  Autocomplete,
} from '@mui/material';

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/tags');
        if (!res.ok) return;
        const data = (await res.json()) as string[];
        if (!cancelled) setTagOptions(data);
      } catch {
        // ignore tag suggestion errors
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = useMemo(() => {
    return Boolean(title.trim()) && Boolean(content.trim()) && tags.length <= 5;
  }, [title, content, tags.length]);

  function mergeTagInput(current: string[], input: string) {
    const extra = input
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    return [...current, ...extra].slice(0, 5);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const merged = mergeTagInput(tags, tagInput);
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: merged.slice(0, 5).map((t) => t.trim()).filter(Boolean),
          published,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create post');
        setLoading(false);
        return;
      }

      // Success - redirect to the post
      router.push(`/post/${data.slug}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            disabled={loading}
            helperText="1-200 characters"
          />

          <TextField
            label="Content (Markdown supported)"
            fullWidth
            required
            multiline
            rows={15}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            disabled={loading}
            helperText="Use Markdown syntax for formatting"
          />

          <Autocomplete
            multiple
            freeSolo
            options={tagOptions}
            value={tags}
            onChange={(_, newValue) => setTags((newValue as string[]).slice(0, 5))}
            inputValue={tagInput}
            onInputChange={(_, newInputValue) => setTagInput(newInputValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={`#${option.replace(/^#+/, '')}`}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                helperText="Press Enter to add tags (max 5)"
                margin="normal"
              />
            )}
            disabled={loading}
          />

          <FormControlLabel
            control={
              <Switch
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                disabled={loading}
              />
            }
            label={published ? 'Published' : 'Draft'}
            sx={{ mt: 2, mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !canSubmit}
            >
              {loading ? 'Saving...' : published ? 'Publish' : 'Save Draft'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
