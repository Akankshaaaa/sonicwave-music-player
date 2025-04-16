import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  useMediaQuery, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Badge,
  Tooltip,
  useTheme 
} from '@mui/material';
import { 
  Home as HomeIcon, 
  LibraryMusic as LibraryIcon, 
  Album as AlbumIcon, 
  Person as ArtistIcon, 
  Search as SearchIcon, 
  Menu as MenuIcon,
  MusicNote,
  Favorite as FavoriteIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePlayer } from '../../context/PlayerContext';

const navItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Library', path: '/library', icon: <LibraryIcon /> },
  { name: 'Albums', path: '/albums', icon: <AlbumIcon /> },
  { name: 'Artists', path: '/artists', icon: <ArtistIcon /> },
  { name: 'Favorites', path: '/favorites', icon: <FavoriteIcon /> }
];

interface NavbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, onSidebarToggle }) => {
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentSong } = usePlayer();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchClick = () => {
    navigate('/search');
    if (mobileOpen) setMobileOpen(false);
  };

  // Gradient text styling for SonicWave title
  const gradientTextStyle = {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold'
  };

  const drawer = (
    <Box sx={{ 
      width: 240, 
      bgcolor: 'background.paper', 
      height: '100%',
      backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
      display: 'flex',
      flexDirection: 'column',
      pb: currentSong ? { xs: '90px', sm: '80px' } : 2, // Add bottom padding if mini player is present
      boxSizing: 'border-box',
      overflow: 'auto',
      pt: isMobile ? '80px' : 0, // Increase top padding on mobile to account for app bar
    }}>
      <Box sx={{ 
        p: 2, 
        display: isMobile ? 'none' : 'flex', // Show only on desktop with flex display
        alignItems: 'center', 
        justifyContent: 'flex-end',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {!isMobile && (
          <IconButton onClick={onSidebarToggle} size="small">
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        )}
      </Box>
      <List sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        pt: isMobile ? 3 : 1, // Increased top padding for mobile
        '& .MuiListItem-root:first-of-type': {
          mt: isMobile ? 2 : 0, // Increased margin for first list item on mobile
        }
      }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                m: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Add Search to Mobile Nav */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link} 
            to="/search"
            selected={location.pathname === '/search'}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              m: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItemButton>
        </ListItem>
      </List>
      
      {/* Display current song in sidebar if playing */}
      {currentSong && (
        <Box sx={{ 
          p: 2, 
          mt: 'auto', 
          mx: 2, 
          mb: 2,
          borderRadius: 2, 
          bgcolor: 'background.paper',
          boxShadow: `0 4px 12px ${theme.palette.primary.main}22`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    border: '2px solid',
                    borderColor: 'background.paper',
                  }}
                />
              }
            >
              <Box
                component="img"
                src={currentSong.cover}
                alt={currentSong.title}
                sx={{ width: 40, height: 40, borderRadius: 1 }}
              />
            </Badge>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" noWrap fontWeight="medium">
                {currentSong.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {currentSong.artist}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper', 
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={isMobile ? handleDrawerToggle : onSidebarToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                ...gradientTextStyle,
                display: 'block',
                textDecoration: 'none'
              }}
            >
              SonicWave
            </Typography>
          </motion.div>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', mx: 'auto', gap: 1 }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    component={Link}
                    to={item.path}
                    sx={{
                      mx: 1,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                      bgcolor: location.pathname === item.path ? 'action.selected' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                    {item.name}
                  </Box>
                </motion.div>
              ))}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* Now Playing Indicator for Desktop */}
            {!isMobile && currentSong && (
              <Box 
                sx={{ 
                  mr: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'action.hover',
                  px: 2,
                  py: 0.5,
                  borderRadius: 6,
                  maxWidth: 200
                }}
              >
                <MusicNote color="primary" fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" noWrap>
                  {currentSong.title}
                </Typography>
              </Box>
            )}
            
            {/* Search Button */}
            <Tooltip title="Search">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  onClick={handleSearchClick}
                  color={location.pathname === '/search' ? 'primary' : 'inherit'}
                  sx={{ 
                    bgcolor: location.pathname === '/search' ? 'action.selected' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240,
              height: '100%',
              paddingBottom: currentSong ? '80px' : 0,
              zIndex: (theme) => theme.zIndex.drawer,
              // Ensure drawer content starts below AppBar
              '& > div': {
                paddingTop: '0px', // Remove redundant padding since we're handling it in the drawer Box component
              },
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      
      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer
          variant={sidebarOpen ? "permanent" : "persistent"}
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240, 
              mt: '64px',
              border: 'none',
              backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              height: 'calc(100% - 64px)',
              paddingBottom: currentSong ? '100px' : '20px', // Add padding to prevent cropping by mini player
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navbar; 