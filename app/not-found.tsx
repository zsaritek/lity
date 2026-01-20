import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }} gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The page you’re looking for doesn’t exist (or was moved).
        </Typography>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button variant="contained">Go home</Button>
        </Link>
      </Box>
    </Container>
  );
}


