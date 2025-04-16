import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Slider, 
  Card, 
  CardMedia, 
  Stack,
  useTheme
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  SkipPrevious, 
  SkipNext, 
  VolumeUp, 
  VolumeOff,
  Album
} from '@mui/icons-material';
import { usePlayer } from '../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface ScrollingTextProps {
  text: string;
  speed?: number;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({ text, speed = 40 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [duplicated, setDuplicated] = useState(false);
  
  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const shouldAnimate = textRef.current.offsetWidth > containerRef.current.offsetWidth;
      setShouldScroll(shouldAnimate);
      setDuplicated(shouldAnimate);
    }
  }, [text]);
  
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        display: 'block', 
        width: '100%', 
        overflow: 'hidden', 
        whiteSpace: 'nowrap',
        position: 'relative'
      }}
    >
      {shouldScroll ? (
        <Box
          ref={textRef}
          sx={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: duplicated ? `scrollText ${text.length * speed}ms linear infinite` : 'none',
            animationDelay: '1s',
            '&::after': duplicated ? {
              content: `" — ${text}"`,
              paddingLeft: '2em'
            } : {},
            '@keyframes scrollText': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: `translateX(-50%)` }
            }
          }}
        >
          {text}
        </Box>
      ) : (
        <Typography 
          noWrap 
          sx={{ 
            display: 'block',
            width: '100%'
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};

const MiniPlayer: React.FC = () => {
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
    toggleMute
  } = usePlayer();
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  if (!currentSong) return null;
  
  const duration = currentSong.duration;
  const currentTime = (progress / 100) * duration;
  
  const handleProgressChange = (_event: Event, newValue: number | number[]) => {
    setProgress(newValue as number);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };
  
  const handleExpandPlayer = () => {
    navigate('/player');
  };
  
  return (
    <Card 
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        p: 1,
        borderRadius: '16px 16px 0 0',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        position: 'relative',
        zIndex: 1100,
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Main container that expands the player when clicked */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%',
          flexWrap: { xs: 'nowrap', sm: 'nowrap' }, // Changed to nowrap for mobile
          '& > *': { flexShrink: 0 } // Make all direct children non-shrinkable
        }}
        onClick={(e) => {
          // Only navigate if clicking on the container, not on controls
          if ((e.target as HTMLElement).closest('button') === null) {
            handleExpandPlayer();
          }
        }}
      >
        {/* Album Cover and Info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: { xs: '50%', sm: '30%', md: '25%' },
          minWidth: { xs: 'auto', sm: '220px' },
          mr: { xs: 0, sm: 2 },
          flexShrink: 1
        }}>
          <Box sx={{ flexShrink: 0 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {currentSong.cover ? (
                <CardMedia
                  component="img"
                  sx={{ width: 48, height: 48, borderRadius: 2 }}
                  image={currentSong.cover}
                  alt={currentSong.title}
                />
              ) : (
                <Box
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'action.selected'
                  }}
                >
                  <Album sx={{ fontSize: 24, color: 'text.secondary' }} />
                </Box>
              )}
            </motion.div>
          </Box>
          <Box sx={{ 
            ml: 1.5, 
            overflow: 'hidden',
            width: '100%'
          }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 'bold',
                display: 'block',
                width: '100%',
                fontSize: { xs: '0.875rem', sm: '1rem' } // Slightly smaller on mobile
              }}
            >
              <ScrollingText text={currentSong.title} />
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                width: '100%',
                fontSize: { xs: '0.75rem', sm: '0.875rem' } // Slightly smaller on mobile
              }}
            >
              <ScrollingText text={currentSong.artist} />
            </Typography>
          </Box>
        </Box>
        
        {/* Mobile Controls - Inline with title for xs screens */}
        <Stack 
          direction="row" 
          spacing={0.5} 
          alignItems="center" 
          justifyContent="flex-end"
          sx={{ 
            ml: 'auto',
            width: { xs: '50%', sm: 'auto' },
            display: { xs: 'flex', sm: 'none' }
          }}
        >
          <IconButton onClick={previousSong} size="small" sx={{ p: 0.5 }}>
            <SkipPrevious fontSize="small" />
          </IconButton>
          
          <IconButton 
            onClick={isPlaying ? pauseSong : resumeSong}
            sx={{ 
              color: 'white',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              width: 32,
              height: 32,
              mx: 0.5
            }}
          >
            {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </IconButton>
          
          <IconButton onClick={nextSong} size="small" sx={{ p: 0.5 }}>
            <SkipNext fontSize="small" />
          </IconButton>
        </Stack>
        
        {/* Playback Controls - For sm screens and up */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            flex: 0,
            minWidth: { sm: '150px' },
            mx: 'auto',
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          <IconButton onClick={previousSong} size="small">
            <SkipPrevious />
          </IconButton>
          
          <IconButton 
            onClick={isPlaying ? pauseSong : resumeSong}
            sx={{ 
              color: 'white',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              width: 40,
              height: 40
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          
          <IconButton onClick={nextSong} size="small">
            <SkipNext />
          </IconButton>
        </Stack>
        
        {/* Progress Slider - Flex Grow */}
        <Box 
          sx={{ 
            flex: 1, 
            mx: 2, 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            minWidth: '200px'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1, width: 40, textAlign: 'right', flexShrink: 0 }}>
            {formatTime(currentTime)}
          </Typography>
          
          <Slider
            value={progress}
            onChange={handleProgressChange}
            size="small"
            sx={{ mx: 1 }}
          />
          
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, width: 40, flexShrink: 0 }}>
            {formatTime(duration)}
          </Typography>
        </Box>
        
        {/* Volume Control - Fixed Width */}
        <Box sx={{ 
          display: { xs: 'none', lg: 'flex' }, 
          alignItems: 'center', 
          width: 140,
          flexShrink: 0
        }}>
          <IconButton 
            onClick={toggleMute} 
            size="small"
            onTouchEnd={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
          >
            {volume === 0 ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            onChangeCommitted={(_, value) => setVolume(value as number)}
            min={0}
            max={1}
            step={0.01}
            size="small"
            sx={{ 
              mx: 1,
              // Make the touch target larger on mobile
              height: 8, // Taller track for better touch targets
              '& .MuiSlider-thumb': {
                width: 14,
                height: 14,
                '&:hover, &.Mui-active': {
                  boxShadow: '0px 0px 0px 8px rgba(108, 99, 255, 0.16)',
                  width: 18,
                  height: 18,
                },
              },
              '& .MuiSlider-rail': {
                height: 8, // Taller rail for better touch target
                borderRadius: 4,
              },
              '& .MuiSlider-track': {
                height: 8, // Taller track for better touch target
                borderRadius: 4,
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
        </Box>
      </Box>
    </Card>
  );
};

export default MiniPlayer; 