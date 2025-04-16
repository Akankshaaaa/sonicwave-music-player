import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  Button, 
  IconButton,
  Avatar,
  Chip,
  Stack,
  Divider,
  useMediaQuery
} from '@mui/material';
import { 
  PlayArrow, 
  MusicNote, 
  Favorite, 
  FavoriteBorder, 
  ArrowForward,
  Explore,
  MoreHoriz
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { albums, songs, artists } from '../data/songs';
import AlbumCard from '../components/Albums/AlbumCard';
import SongItem from '../components/Library/SongItem';
import { usePlayer } from '../context/PlayerContext';
import { Song } from '../models/types';

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { playSong, isSongFavorite, toggleFavorite } = usePlayer();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [featuredAlbum, setFeaturedAlbum] = useState(albums[0]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [recommendedAlbums, setRecommendedAlbums] = useState<typeof albums>([]);
  
  // Set up recommendations only once on component mount
  useEffect(() => {
    const shuffled = [...albums].sort(() => 0.5 - Math.random()).slice(0, 3);
    setRecommendedAlbums(shuffled);
  }, []);
  
  // Rotating featured album for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * albums.length);
      setFeaturedAlbum(albums[randomIndex]);
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Display only first 5 songs on home page
  const recentSongs = songs.slice(0, 5);
  
  const handleToggleFavorite = (song: Song) => {
    toggleFavorite(song);
  };
  
  const playFeaturedAlbum = () => {
    if (featuredAlbum.songs.length > 0) {
      playSong(featuredAlbum.songs[0]);
    }
  };
  
  // Album showcase animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Limit number of visible albums based on screen size
  const visibleAlbums = isMediumScreen ? 
    (isSmallScreen ? albums.slice(0, 4) : albums.slice(0, 6)) : 
    albums.slice(0, 8);
  
  return (
    <Box>
      {/* Hero Section with Featured Album */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            mb: 5,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, 
                        ${theme.palette.primary.dark}33 50%, 
                        ${theme.palette.background.paper} 100%)`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 10px 40px ${theme.palette.primary.main}20`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.palette.primary.main}22 0%, transparent 70%)`,
              zIndex: 0,
              filter: 'blur(40px)',
            }}
          />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(58% - 16px)' } }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Typography 
                  variant={isSmallScreen ? "h3" : "h2"} 
                  component="h1" 
                  fontWeight="bold" 
                  gutterBottom
                  sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  SonicWave
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                  Experience your music like never before
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Explore />}
                    onClick={() => navigate('/library')}
                    sx={{ 
                      px: 3, 
                      py: 1,
                      fontSize: '1rem'
                    }}
                  >
                    Explore Library
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/search')}
                    sx={{ px: 3, py: 1 }}
                  >
                    Search
                  </Button>
                </Stack>
                
                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    mt: 2, 
                    display: { xs: 'none', sm: 'flex' } 
                  }}
                >
                  {artists.slice(0, 3).map((artist) => (
                    <Chip
                      key={artist.id}
                      avatar={<Avatar alt={artist.name} src={artist.image} />}
                      label={artist.name}
                      onClick={() => navigate(`/artists/${artist.id}`)}
                      sx={{ 
                        px: 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                  <Chip
                    icon={<MoreHoriz />}
                    label="More Artists"
                    onClick={() => navigate('/artists')}
                    variant="outlined"
                    sx={{ 
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                </Stack>
              </motion.div>
            </Box>
            
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 calc(42% - 16px)' }, 
              display: 'flex', 
              justifyContent: 'center' 
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredAlbum.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                  transition={{ duration: 0.5 }}
                  style={{ perspective: 1000 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: '200px', sm: '220px', md: '240px' },
                      height: { xs: '200px', sm: '220px', md: '240px' },
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: `0 20px 40px ${theme.palette.primary.main}33`,
                      transform: 'perspective(1000px) rotateY(-5deg)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'perspective(1000px) rotateY(0deg) scale(1.05)',
                        boxShadow: `0 30px 50px ${theme.palette.primary.main}55`,
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={featuredAlbum.cover}
                      alt={featuredAlbum.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Play button overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {featuredAlbum.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                          {featuredAlbum.artist}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={playFeaturedAlbum}
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <PlayArrow />
                      </IconButton>
                    </Box>
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
        </Paper>
      </motion.div>
      
      {/* Recent Albums */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MusicNote sx={{ mr: 1, color: 'primary.main' }} />
              Featured Albums
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover the latest and greatest
            </Typography>
          </Box>
          <Button 
            endIcon={<ArrowForward />}
            onClick={() => navigate('/albums')}
            sx={{ 
              fontWeight: 'medium',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            View All
          </Button>
        </Box>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(3, 1fr)', 
              md: 'repeat(4, 1fr)', 
              lg: 'repeat(6, 1fr)' 
            }, 
            gap: { xs: 2, sm: 3 },
            '& > div': {
              width: '100%',
              height: '100%'
            }
          }}>
            {visibleAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -10 }}
                style={{ width: '100%' }}
              >
                <AlbumCard album={album} />
                
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      size="small"
                      fullWidth
                      onClick={() => album.songs.length > 0 && playSong(album.songs[0])}
                      sx={{ 
                        mt: 1,
                        borderRadius: 2
                      }}
                    >
                      Play
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>
      
      {/* Recommendations */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Favorite sx={{ mr: 1, color: 'secondary.main' }} />
            Recommended For You
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on your listening history
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {recommendedAlbums.map((album) => (
            <Box key={album.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.33% - 16px)' } }}>
              <Paper
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'column' },
                  height: { xs: 'auto', sm: '320px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 12px 20px ${theme.palette.primary.main}20`,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    flex: { xs: '0 0 120px', sm: 'auto' },
                    height: { xs: '120px', sm: '200px' },
                    position: 'relative',
                    overflow: 'hidden',
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
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => album.songs.length > 0 && playSong(album.songs[0])}
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      bgcolor: 'primary.main',
                      color: 'white',
                      opacity: 0.9,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        opacity: 1,
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <PlayArrow />
                  </IconButton>
                </Box>
                
                <Box sx={{ p: 2, flex: 1 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {album.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {album.artist}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
                  </Typography>
                  
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate(`/albums/${album.id}`)}
                    sx={{ 
                      mt: { xs: 1, sm: 2 },
                      color: 'primary.main'
                    }}
                  >
                    See Details
                  </Button>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Recent Songs */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Recently Added
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your latest additions
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForward />}
            onClick={() => navigate('/library')}
            sx={{ 
              fontWeight: 'medium',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            View All
          </Button>
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 12px 20px ${theme.palette.primary.main}20`,
            }
          }}
        >
          {recentSongs.map((song, index) => (
            <Box key={song.id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%' }}>
                  <SongItem song={song} index={index} />
                </Box>
                <IconButton 
                  onClick={() => handleToggleFavorite(song)}
                  sx={{ 
                    mr: 2,
                    color: isSongFavorite(song.id) ? 'error.main' : 'text.secondary',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isSongFavorite(song.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>
              {index < recentSongs.length - 1 && (
                <Divider sx={{ opacity: 0.3 }} />
              )}
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default Home; 