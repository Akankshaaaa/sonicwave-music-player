import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Divider,
  useTheme
} from '@mui/material';
import { 
  PlayArrow, 
  Shuffle, 
  ArrowBack
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { albums } from '../data/songs';
import SongItem from '../components/Library/SongItem';
import { usePlayer } from '../context/PlayerContext';

const AlbumDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { playSong } = usePlayer();
  
  // Find album by id
  const album = albums.find(album => album.id === id);
  
  if (!album) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Album not found
        </Typography>
        <Box sx={{ mt: 2 }}>
          <IconButton color="primary" onClick={() => navigate('/albums')}>
            <ArrowBack />
          </IconButton>
        </Box>
      </Box>
    );
  }
  
  const handlePlayAll = () => {
    if (album.songs.length > 0) {
      playSong(album.songs[0]);
    }
  };
  
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">
            Album Details
          </Typography>
        </Box>
        
        {/* Album Info */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            mb: 4,
            gap: 4
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={6}
              sx={{
                width: { xs: '80vw', sm: '300px' },
                height: { xs: '80vw', sm: '300px' },
                maxWidth: '300px',
                maxHeight: '300px',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: `0 20px 40px ${theme.palette.primary.main}22`,
              }}
            >
              <Box
                component="img"
                src={album.cover}
                alt={album.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </motion.div>
          
          <Box sx={{ 
            textAlign: { xs: 'center', md: 'left' },
            flex: 1
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {album.title}
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {album.artist}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
            </Typography>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
              <IconButton
                color="primary"
                size="large"
                onClick={handlePlayAll}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 2,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <PlayArrow fontSize="large" />
              </IconButton>
              
              <IconButton
                color="primary"
                size="large"
                sx={{
                  bgcolor: 'action.selected',
                  p: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Shuffle fontSize="medium" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Song List */}
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Songs
          </Typography>
          
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {album.songs.map((song, index) => (
              <SongItem key={song.id} song={song} index={index} />
            ))}
          </Paper>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AlbumDetail; 