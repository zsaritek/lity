import { extendTheme } from '@mui/material/styles';

export const theme = extendTheme({
  // Enable manual toggling via `useColorScheme().setMode(...)`.
  // Default is 'media', which only follows `prefers-color-scheme` and ignores setMode.
  colorSchemeSelector: 'data',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#2563eb', // Blue
          light: '#60a5fa',
          dark: '#1e40af',
        },
        secondary: {
          main: '#8b5cf6', // Purple
          light: '#a78bfa',
          dark: '#6d28d9',
        },
        error: {
          main: '#ef4444',
        },
        warning: {
          main: '#f59e0b',
        },
        info: {
          main: '#3b82f6',
        },
        success: {
          main: '#10b981',
        },
        background: {
          default: '#f9fafb',
          paper: '#ffffff',
        },
        text: {
          primary: '#111827',
          secondary: '#6b7280',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#60a5fa',
          light: '#93c5fd',
          dark: '#2563eb',
        },
        secondary: {
          main: '#a78bfa',
          light: '#c4b5fd',
          dark: '#8b5cf6',
        },
        error: {
          main: '#f87171',
        },
        warning: {
          main: '#fbbf24',
        },
        info: {
          main: '#93c5fd',
        },
        success: {
          main: '#34d399',
        },
        background: {
          default: '#0b1220',
          paper: '#111827',
        },
        text: {
          primary: '#f9fafb',
          secondary: '#9ca3af',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});
