import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MiniPlayer from '../Player/MiniPlayer';
import { usePlayer } from '../../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const { currentSong } = usePlayer();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <Navbar sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          mt: { xs: 7, sm: 8 },
          ml: { xs: 0, md: sidebarOpen ? '240px' : '0' },
          width: { xs: '100%', md: sidebarOpen ? `calc(100% - 240px)` : '100%' },
          mb: currentSong ? { xs: '100px', sm: '80px' } : 0,
          pb: { xs: 6, sm: 4 },
          overflowY: 'auto',
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Box>
      
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1300,
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <MiniPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Layout; 