import Link from 'next/link';
import { Box, Typography } from '@mui/material';

type LogoProps = {
  href?: string;
};

export default function Logo({ href = '/' }: LogoProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box
          aria-hidden
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            background:
              'linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(139,92,246,1) 100%)',
            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.25)',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.06em',
              color: '#fff',
              WebkitTextFillColor: '#fff',
              fontSize: 18,
              lineHeight: 1,
              textShadow: '0 1px 2px rgba(0,0,0,0.35)',
            }}
          >
            L
          </Typography>
        </Box>

        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.04em',
            fontSize: 20,
            lineHeight: 1,
            background:
              'linear-gradient(90deg, rgba(17,24,39,1) 0%, rgba(37,99,235,1) 45%, rgba(139,92,246,1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            // Dark mode: use a brighter wordmark
            [':root[data-mui-color-scheme="dark"] &']: {
              background:
                'linear-gradient(90deg, rgba(248,250,252,1) 0%, rgba(147,197,253,1) 50%, rgba(167,139,250,1) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          }}
        >
          Lity
        </Typography>
      </Box>
    </Link>
  );
}


