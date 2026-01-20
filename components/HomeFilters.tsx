'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

export default function HomeFilters({ tags }: { tags: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') ?? '';
  const initialTag = searchParams.get('tag') ?? '';

  const [search, setSearch] = useState(initialSearch);
  const [tag, setTag] = useState(initialTag);

  // Keep inputs in sync when user navigates back/forward.
  useEffect(() => {
    setSearch(initialSearch);
    setTag(initialTag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch, initialTag]);

  const hasFilters = useMemo(() => {
    return Boolean(search.trim()) || Boolean(tag);
  }, [search, tag]);

  function apply(next: { search?: string; tag?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      const s = next.search.trim();
      if (s) params.set('search', s);
      else params.delete('search');
    }

    if (next.tag !== undefined) {
      if (next.tag) params.set('tag', next.tag);
      else params.delete('tag');
    }

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    apply({ search, tag });
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        mb: 3,
      }}
    >
      <Box sx={{ minWidth: 280, flex: '1 1 320px' }}>
        <TextField
          label="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      <Box sx={{ minWidth: 220, flex: '0 0 240px' }}>
        <TextField
          select
          label="Filter by tag"
          value={tag}
          onChange={(e) => {
            const next = e.target.value;
            setTag(next);
            // Apply immediately for tag changes
            apply({ tag: next });
          }}
          fullWidth
          size="small"
        >
          <MenuItem value="">
            <Typography variant="body2" color="text.secondary">
              All tags
            </Typography>
          </MenuItem>
          {tags.map((t) => (
            <MenuItem key={t} value={t}>
              #{t}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button type="submit" variant="contained" size="small">
        Search
      </Button>

      <Button
        type="button"
        variant="text"
        size="small"
        disabled={!hasFilters}
        onClick={() => {
          setSearch('');
          setTag('');
          apply({ search: '', tag: '' });
        }}
      >
        Clear
      </Button>
    </Box>
  );
}


