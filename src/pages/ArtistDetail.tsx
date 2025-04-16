import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tabs,
  Tab,
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
import { artists } from '../data/songs';
import SongItem from '../components/Library/SongItem';
import AlbumCard from '../components/Albums/AlbumCard';
import { usePlayer } from '../context/PlayerContext';

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { playSong } = usePlayer();
  const [tabValue, setTabValue] = React.useState(0);
  
  // Find artist by id
  const artist = artists.find(artist => artist.id === id);
  
  if (!artist) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Artist not found
        </Typography>
        <Box sx={{ mt: 2 }}>
          <IconButton color="primary" onClick={() => navigate('/artists')}>
            <ArrowBack />
          </IconButton>
        </Box>
      </Box>
    );
  }
  
  // Get all songs from all albums
  const allSongs = artist.albums.flatMap(album => album.songs);
  
  const handlePlayAll = () => {
    if (allSongs.length > 0) {
      playSong(allSongs[0]);
    }
  };
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
            Artist Details
          </Typography>
        </Box>
        
        {/* Artist Info */}
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
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: `0 20px 40px ${theme.palette.primary.main}22`,
              }}
            >
              <Box
                component="img"
                src={artist.image}
                alt={artist.name}
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
              {artist.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {artist.albums.length} {artist.albums.length === 1 ? 'album' : 'albums'} • {allSongs.length} songs
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
        
        {/* Tabs */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{ mb: 4 }}
          >
            <Tab label="Albums" />
            <Tab label="Songs" />
          </Tabs>
          
          {/* Albums Tab */}
          {tabValue === 0 && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: 'repeat(1, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)' 
              }, 
              gap: 3 
            }}>
              {artist.albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AlbumCard album={album} />
                </motion.div>
              ))}
            </Box>
          )}
          
          {/* Songs Tab */}
          {tabValue === 1 && (
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              {allSongs.map((song, index) => (
                <SongItem key={song.id} song={song} index={index} />
              ))}
            </Paper>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default ArtistDetail; 