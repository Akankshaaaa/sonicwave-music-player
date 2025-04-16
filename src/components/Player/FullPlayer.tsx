import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Slider, 
  Paper,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fab,
  Chip
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipPrevious, 
  SkipNext, 
  VolumeUp, 
  VolumeOff, 
  Repeat, 
  RepeatOne, 
  Shuffle, 
  ExpandMore,
  QueueMusic,
  Album as AlbumIcon,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { usePlayer } from '../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { artists } from '../../data/songs';
import { Artist } from '../../models/types';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Vinyl record animation component
interface VinylRecordProps {
  isPlaying: boolean;
  coverImage: string;
}

const VinylRecord: React.FC<VinylRecordProps> = ({ isPlaying, coverImage }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Vinyl record */}
      <motion.div
        animate={{
          rotate: isPlaying ? 360 : 0,
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: isPlaying ? Infinity : 0,
        }}
        style={{
          width: '95%',
          height: '95%',
          borderRadius: '50%',
          aspectRatio: '1/1',
          background: `
            radial-gradient(
              circle at center,
              #111 0%,
              #111 18%,
              #333 20%,
              #333 30%,
              #111 32%,
              #111 38%,
              #333 40%,
              #333 42%,
              #111 44%,
              #111 60%,
              #333 62%,
              #333 64%,
              #111 66%,
              #111 68%,
              #333 70%,
              #333 72%,
              #111 74%,
              #111 100%
            )
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Center label with album art */}
        <motion.div
          style={{
            width: '38%',
            height: '38%',
            borderRadius: '50%',
            backgroundImage: `url(${coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: `0 0 10px ${theme.palette.primary.main}80`,
            border: `4px solid ${theme.palette.background.paper}`,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const FullPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    volume,
    pauseSong, 
    resumeSong, 
    nextSong, 
    previousSong, 
    setProgress,
    setVolume,
    toggleMute,
    repeatMode,
    isShuffled,
    toggleShuffle,
    cycleRepeatMode,
    isSongFavorite,
    toggleFavorite
  } = usePlayer();
  
  const theme = useTheme();
  const navigate = useNavigate();
  const isXsSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [showVinyl, setShowVinyl] = useState(false);
  
  if (!currentSong) {
    navigate('/');
    return null;
  }
  
  // Check if current song is in favorites
  const isLiked = isSongFavorite(currentSong.id);
  
  const duration = currentSong.duration;
  const currentTime = (progress / 100) * duration;
  
  const handleClosePlayer = () => {
    navigate(-1);
  };
  
  const handleToggleFavorite = () => {
    if (currentSong) {
      toggleFavorite(currentSong);
    }
  };
  
  const toggleVinylView = () => {
    setShowVinyl(!showVinyl);
  };
  
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1400,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(180deg, 
          ${theme.palette.primary.dark}30 0%, 
          ${theme.palette.background.default} 40%, 
          ${theme.palette.background.default} 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background visual elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.4,
        }}
      >
        {/* Main glowing orb */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
            filter: 'blur(70px)',
          }}
        />
        
        {/* Secondary glowing orb */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.palette.secondary.main}20 10%, transparent 70%)`,
            filter: 'blur(60px)',
          }}
        />
      </Box>
      
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          height: '64px',
          boxSizing: 'border-box',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
        }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <IconButton onClick={handleClosePlayer} sx={{ color: 'text.primary' }}>
            <ExpandMore />
          </IconButton>
        </motion.div>
        
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography 
            variant="subtitle1" 
            fontWeight="bold"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Now Playing
          </Typography>
        </Box>
      </Box>
      
      {/* Main Content Area - Adjust height calculation to account for removed visualizer */}
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'calc(100vh - 124px - 90px)', md: 'calc(100vh - 124px)' }, // Reduced by 50px (visualizer height)
          width: '100%',
          maxWidth: { xs: '100%', md: '900px' },
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          zIndex: 1,
          pb: { xs: 2, sm: 4 },
          overflow: { xs: 'auto', sm: 'visible' },
          paddingBottom: {
            xs: '1rem',
            sm: '4rem'
          },
        }}
      >
        {/* Top Section - Album Art and Song Info */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: 'auto',
            maxHeight: { xs: '60%', md: '70%' },
            pt: { xs: 2, sm: 3 },
            overflow: 'visible'
          }}
        >
          {/* Album Art with 3D perspective effect */}
          <Box 
            sx={{ 
              height: { xs: '65%', sm: '70%' },
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 },
              perspective: '1000px',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentSong.id}-${showVinyl}`}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ 
                  height: '100%', 
                  maxHeight: '100%',
                  width: '100%',
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={toggleVinylView}
              >
                {showVinyl ? (
                  <Box
                    sx={{ 
                      height: '250px',
                      width: '250px',
                      maxWidth: { xs: '80vw', sm: '250px' },
                      minWidth: { xs: '200px', sm: '250px' },
                      maxHeight: '250px',
                      aspectRatio: '1/1',
                      borderRadius: '50%',
                      boxShadow: `0 20px 60px ${theme.palette.common.black}50`,
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <VinylRecord isPlaying={isPlaying} coverImage={currentSong.cover} />
                  </Box>
                ) : (
                  <Paper
                    elevation={12}
                    component="div"
                    sx={{
                      height: '250px',
                      width: '250px',
                      maxWidth: { xs: '80vw', sm: '250px' },
                      minWidth: { xs: '200px', sm: '250px' },
                      maxHeight: '250px',
                      aspectRatio: '1/1',
                      borderRadius: 6,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: `0 20px 60px ${theme.palette.primary.main}33`,
                      background: `url(${currentSong.cover}) no-repeat center center`,
                      backgroundSize: 'cover',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backdropFilter: 'blur(0px)',
                        background: 'linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.8) 100%)',
                        opacity: 0.2,
                        transition: 'all 0.3s ease',
                      },
                      '&:hover::after': {
                        opacity: 0.4,
                      }
                    }}
                  >
                    <Tooltip title={showVinyl ? "Show Album Cover" : "Show Vinyl"}>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                          zIndex: 2,
                        }}
                      >
                        <Fab
                          size="small"
                          sx={{ 
                            bgcolor: 'background.paper',
                            opacity: 0.6,
                            '&:hover': {
                              opacity: 1,
                              bgcolor: 'background.paper',
                            }
                          }}
                        >
                          <AlbumIcon />
                        </Fab>
                      </Box>
                    </Tooltip>
                  </Paper>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
          
          {/* Song Info with clearer display of song title, artist, and album */}
          <Box sx={{ 
            width: '100%',
            textAlign: 'center',
            my: { xs: 1, sm: 2 },
            overflow: 'visible',
            mb: { xs: 3, sm: 4 }
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 1,
              gap: 1
            }}>
              <Chip 
                label={`${currentSong.artist}`}
                size="small"
                sx={{ 
                  bgcolor: 'action.selected',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => {
                  navigate(`/artists/${artists.find(a => a.name === currentSong.artist)?.id || ''}`);
                }}
              />
              <IconButton onClick={handleToggleFavorite} color={isLiked ? 'error' : 'default'} size="small">
                {isLiked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
            
            {/* Song Title */}
            <motion.div
              key={currentSong.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography 
                variant={isXsSmall ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  lineHeight: 1.2,
                  mb: { xs: 0.5, sm: 1 }
                }}
              >
                {currentSong.title}
              </Typography>
            </motion.div>
            
            {/* Removed duplicate Artist section and kept only the album section */}
            <motion.div
              key={`album-${currentSong.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Typography 
                variant={isXsSmall ? "body2" : "subtitle1"} 
                color="text.secondary"
                sx={{ lineHeight: 1.2 }}
              >
                Album: {currentSong.album}
              </Typography>
            </motion.div>
          </Box>
          
          {/* Visual separator - subtle divider */}
          <Box sx={{ 
            width: '80%',
            mx: 'auto',
            mb: { xs: 3, sm: 4 },
            height: '1px',
            background: `linear-gradient(to right, transparent 0%, ${theme.palette.divider} 50%, transparent 100%)`,
            opacity: 0.6
          }}/>
        </Box>
        
        {/* Bottom Section - Player Controls */}
        <Box 
          sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            mt: { xs: 0, sm: 3 },
            mb: { xs: 0, sm: 4 },
            position: 'relative',
            flexShrink: 0,
            pb: { xs: 0, sm: 4 },
          }}
        >
          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Slider
              value={progress}
              onChange={(_, value) => setProgress(value as number)}
              sx={{
                color: theme.palette.primary.main,
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  transition: 'all 0.2s ease',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
                    width: 20,
                    height: 20,
                  },
                },
                '& .MuiSlider-track': {
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant={isXsSmall ? "caption" : "body2"} color="text.secondary">
                {formatTime(currentTime)}
              </Typography>
              <Typography variant={isXsSmall ? "caption" : "body2"} color="text.secondary">
                {formatTime(duration)}
              </Typography>
            </Box>
          </Box>
          
          {/* Controls */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 6,
              bgcolor: 'background.paper',
              backdropFilter: 'blur(10px)',
              background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
              mb: { xs: 2, sm: 1 },
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* Shuffle */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title={isShuffled ? "Shuffle On" : "Shuffle Off"}>
                  <IconButton 
                    onClick={toggleShuffle} 
                    color={isShuffled ? 'primary' : 'default'}
                    size={isXsSmall ? "small" : "medium"}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Shuffle fontSize={isXsSmall ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              </motion.div>
              
              {/* Previous */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  onClick={previousSong} 
                  size={isXsSmall ? "medium" : "large"}
                  sx={{ 
                    mx: { xs: 0.5, sm: 1 },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <SkipPrevious sx={{ fontSize: { xs: 25, sm: 35 } }} />
                </IconButton>
              </motion.div>
              
              {/* Play/Pause */}
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                initial={false}
                animate={isPlaying ? { rotate: [0, 0] } : { rotate: [0, 0] }}
              >
                <IconButton
                  onClick={isPlaying ? pauseSong : resumeSong}
                  size={isXsSmall ? "medium" : "large"}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: 'white',
                    p: { xs: 1.5, sm: 2 },
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 10px ${theme.palette.primary.main}66`,
                  }}
                >
                  {isPlaying ? 
                    <Pause sx={{ fontSize: { xs: 25, sm: 35 } }} /> : 
                    <PlayArrow sx={{ fontSize: { xs: 25, sm: 35 } }} />
                  }
                </IconButton>
              </motion.div>
              
              {/* Next */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  onClick={nextSong} 
                  size={isXsSmall ? "medium" : "large"}
                  sx={{ 
                    mx: { xs: 0.5, sm: 1 },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <SkipNext sx={{ fontSize: { xs: 25, sm: 35 } }} />
                </IconButton>
              </motion.div>
              
              {/* Repeat */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title={
                  repeatMode === 'off' ? "Repeat Off" : 
                  repeatMode === 'all' ? "Repeat All" : 
                  "Repeat One"
                }>
                  <IconButton 
                    onClick={cycleRepeatMode} 
                    color={repeatMode !== 'off' ? 'primary' : 'default'}
                    size={isXsSmall ? "small" : "medium"}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {repeatMode === 'one' ? 
                      <RepeatOne fontSize={isXsSmall ? "small" : "medium"} /> : 
                      <Repeat fontSize={isXsSmall ? "small" : "medium"} />
                    }
                  </IconButton>
                </Tooltip>
              </motion.div>
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Volume Control - Fixed at bottom on mobile, inside content area on desktop */}
      {isXsSmall ? (
        <Box sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0px -4px 20px rgba(0,0,0,0.15)',
          zIndex: 10,
          minHeight: '70px',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: '16px 16px 0 0',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 8px)',
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
            <IconButton 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleMute();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleMute();
              }}
              size="small"
              color={volume > 0 ? 'primary' : 'default'}
              sx={{ 
                p: 1,
                width: 40,
                height: 40,
                touchAction: 'none'
              }}
            >
              {volume === 0 ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
            </IconButton>
            
            <Slider
              value={volume}
              onChange={(_, value) => {
                // Immediately apply volume changes as the slider moves
                setVolume(value as number);
              }}
              onChangeCommitted={(_, value) => {
                // Again set the volume when the interaction ends
                setVolume(value as number);
              }}
              min={0}
              max={1}
              step={0.01}
              size="small"
              sx={{ 
                mx: 1,
                width: 'calc(100% - 100px)',
                color: theme.palette.primary.main,
                height: 8, // Taller track for better mobile touch targets
                '& .MuiSlider-thumb': {
                  width: 18,  // Larger thumb for mobile
                  height: 18, // Larger thumb for mobile
                  transition: 'all 0.1s ease',
                  '&:hover, &.Mui-active, &.Mui-focusVisible': {
                    width: 22,
                    height: 22,
                    boxShadow: '0px 0px 0px 8px rgba(108, 99, 255, 0.16)',
                  },
                },
                '& .MuiSlider-rail': {
                  height: 8, // Taller rail for better mobile touch targets
                  borderRadius: 4,
                },
                '& .MuiSlider-track': {
                  height: 8, // Taller track for better mobile touch targets
                  borderRadius: 4,
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
                // Improve touch area
                '@media (pointer: coarse)': {
                  padding: '12px 0',
                },
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                e.stopPropagation();
                // Make sure this touch is exclusively handled by the slider
                document.body.style.overflow = 'hidden';
              }}
              onTouchEnd={() => {
                // Restore scrolling when touch ends
                document.body.style.overflow = '';
              }}
              aria-label="Volume"
            />
            
            <Chip
              label={`${Math.round(volume * 100)}%`}
              size="small"
              sx={{ 
                minWidth: 45,
                height: 22,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          alignItems: 'center',
          p: 1,
          borderRadius: 4,
          bgcolor: 'background.default',
          overflow: 'visible',
          flexWrap: 'nowrap',
          mb: 2,
          width: '100%',
          maxWidth: { md: '900px' },
          mx: 'auto',
          px: { sm: 3, md: 4 },
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            width: 'auto',
            justifyContent: 'flex-start',
          }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                onClick={toggleMute} 
                size="small"
                color={volume > 0 ? 'primary' : 'default'}
              >
                {volume === 0 ? <VolumeOff /> : <VolumeUp />}
              </IconButton>
            </motion.div>
            
            <Slider
              value={volume}
              onChange={(_, value) => setVolume(value as number)}
              onChangeCommitted={(_, value) => setVolume(value as number)}
              min={0}
              max={1}
              step={0.01}
              size="small"
              sx={{ 
                mx: 2,
                width: 150,
                color: theme.palette.primary.main,
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  transition: 'all 0.1s ease',
                  '&:hover, &.Mui-active': {
                    width: 18,
                    height: 18,
                    boxShadow: '0px 0px 0px 8px rgba(108, 99, 255, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Volume"
            />
            
            <Chip
              label={`${Math.round(volume * 100)}%`}
              size="small"
              sx={{ 
                minWidth: 50,
                height: 24,
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FullPlayer; 