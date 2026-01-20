'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    CircularProgress,
} from '@mui/material';

type PostResponse = {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    tags: { id: string; name: string }[];
};

export default function EditPostPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [published, setPublished] = useState(false);

    const [tagOptions, setTagOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!id) return;
            setError('');
            setLoading(true);
            try {
                const [postRes, tagsRes] = await Promise.all([
                    fetch(`/api/posts/${id}`),
                    fetch('/api/tags'),
                ]);

                if (!postRes.ok) {
                    const data = await postRes.json().catch(() => ({}));
                    throw new Error(data.error || 'Failed to load post');
                }

                const post = (await postRes.json()) as PostResponse;
                if (cancelled) return;

                setTitle(post.title);
                setContent(post.content);
                setPublished(post.published);
                setTags(post.tags.map((t) => t.name));

                if (tagsRes.ok) {
                    const tagList = (await tagsRes.json()) as string[];
                    if (!cancelled) setTagOptions(tagList);
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Something went wrong');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const canSave = useMemo(() => {
        return Boolean(title.trim()) && Boolean(content.trim()) && tags.length <= 5 && !saving;
    }, [title, content, tags.length, saving]);

    function mergeTagInput(current: string[], input: string) {
        const extra = input
            .split(/[\s,]+/)
            .map((t) => t.trim())
            .filter(Boolean);
        return [...current, ...extra].slice(0, 5);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!id) return;
        setError('');
        setSaving(true);
        try {
            const merged = mergeTagInput(tags, tagInput);
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
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
                setError(data.error || 'Failed to update post');
                return;
            }

            router.push(`/post/${data.slug}`);
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!id) return;
        const ok = window.confirm('Delete this post? This cannot be undone.');
        if (!ok) return;

        setError('');
        setSaving(true);
        try {
            const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || 'Failed to delete post');
                return;
            }
            router.push('/');
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Post
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <form onSubmit={handleSave}>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            margin="normal"
                            disabled={saving}
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
                            disabled={saving}
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
                                        key={`${option}-${index}`}
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
                            disabled={saving}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={published}
                                    onChange={(e) => setPublished(e.target.checked)}
                                    disabled={saving}
                                />
                            }
                            label={published ? 'Published' : 'Draft'}
                            sx={{ mt: 2, mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                            <Button type="submit" variant="contained" size="large" disabled={!canSave}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => router.back()}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                variant="text"
                                color="error"
                                size="large"
                                onClick={handleDelete}
                                disabled={saving}
                            >
                                Delete
                            </Button>
                        </Box>
                    </form>
                )}
            </Paper>
        </Container>
    );
}


