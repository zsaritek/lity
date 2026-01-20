'use client';

import { useState } from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';

type ProfileEditFormProps = {
  initialBio: string | null;
  initialAvatar: string | null;
  initialSocialLink: string | null;
};

export default function ProfileEditForm({
  initialBio,
  initialAvatar,
  initialSocialLink,
}: ProfileEditFormProps) {
  const [bio, setBio] = useState(initialBio ?? '');
  const [avatar, setAvatar] = useState(initialAvatar ?? '');
  const [socialLink, setSocialLink] = useState(initialSocialLink ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: bio.trim() ? bio.trim() : null,
          avatar: avatar.trim() ? avatar.trim() : null,
          socialLink: socialLink.trim() ? socialLink.trim() : null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Profile updated
        </Alert>
      )}

      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        multiline
        minRows={3}
        margin="normal"
        disabled={loading}
        helperText="Max 500 characters"
      />
      <TextField
        label="Avatar URL"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />
      <TextField
        label="Social Link"
        value={socialLink}
        onChange={(e) => setSocialLink(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </Box>
  );
}


