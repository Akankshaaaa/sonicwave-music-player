import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import SongItem from '../components/Library/SongItem';
import { FavoriteBorder } from '@mui/icons-material';

const Favorites: React.FC = () => {
  const { favoriteSongs } = usePlayer();
  
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Your Favorites
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Songs you've marked as favorites
          </Typography>
        </Box>
        
        {/* Favorites List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {favoriteSongs.length > 0 ? (
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              {favoriteSongs.map((song, index) => (
                <SongItem key={song.id} song={song} index={index} />
              ))}
            </Paper>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                opacity: 0.7
              }}
            >
              <FavoriteBorder sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                You haven't added any favorites yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click the heart icon on any song to add it to your favorites
              </Typography>
            </Box>
          )}
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Favorites; 