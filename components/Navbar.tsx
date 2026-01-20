'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useColorScheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { mode, setMode } = useColorScheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Logo />

          <Box sx={{ flexGrow: 1 }} />

          {mode && (
            <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                color="inherit"
                sx={{ mr: 1 }}
                aria-label="toggle color scheme"
              >
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          )}

          {status === 'loading' ? (
            <Typography variant="body2">Loading...</Typography>
          ) : isMobile ? (
            <>
              <IconButton
                aria-label="open navigation menu"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                {session ? (
                  <>
                    <MenuItem disabled>
                      Hello, {session.user?.username || session.user?.email}
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        router.push('/editor');
                      }}
                    >
                      New Post
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        router.push(`/profile/${session.user?.username}`);
                      }}
                    >
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={async () => {
                        setAnchorEl(null);
                        await handleSignOut();
                      }}
                    >
                      Sign Out
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        router.push('/signin');
                      }}
                    >
                      Sign In
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);
                        router.push('/signup');
                      }}
                    >
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : session ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2">
                Hello, <strong>{session.user?.username || session.user?.email}</strong>
              </Typography>
              <Button
                component={Link}
                href="/editor"
                variant="contained"
                size="small"
                color="secondary"
              >
                New Post
              </Button>
              <Button
                component={Link}
                href={`/profile/${session.user?.username}`}
                variant="outlined"
                size="small"
                color="inherit"
              >
                Profile
              </Button>
              <Button
                onClick={handleSignOut}
                variant="text"
                size="small"
                color="inherit"
              >
                Sign Out
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/signin"
                variant="outlined"
                size="small"
                color="inherit"
              >
                Sign In
              </Button>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="small"
                color="secondary"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
