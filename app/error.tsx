'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for dev visibility; production should use an error reporting service.
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
          Something went wrong
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Please try again. If this keeps happening, return to home.
        </Typography>

        {error.digest && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Error digest: {error.digest}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={reset}>
            Try again
          </Button>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="outlined">Go home</Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}


