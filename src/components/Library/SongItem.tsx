import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  ListItem, 
  ListItemAvatar, 
  Avatar,
  ListItemText,
  ListItemButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  MoreVert, 
  PlaylistAdd, 
  Favorite, 
  FavoriteBorder
} from '@mui/icons-material';
import { usePlayer } from '../../context/PlayerContext';
import { Song } from '../../models/types';
import { motion } from 'framer-motion';

interface SongItemProps {
  song: Song;
  index: number;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const SongItem: React.FC<SongItemProps> = ({ song, index }) => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong, addToQueue, isSongFavorite, toggleFavorite } = usePlayer();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const isCurrentSong = currentSong?.id === song.id;
  const open = Boolean(anchorEl);
  const isFavorite = isSongFavorite(song.id);
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    handleClose();
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(song);
    handleClose();
  };

  const handlePlayPause = () => {
    if (isCurrentSong) {
      if (isPlaying) {
        pauseSong();
      } else {
        resumeSong();
      }
    } else {
      playSong(song);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <ListItem
        disablePadding
        secondaryAction={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {formatTime(song.duration)}
            </Typography>
            <IconButton 
              edge="end" 
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleAddToQueue}>
                <PlaylistAdd sx={{ mr: 1 }} fontSize="small" /> Add to Queue
              </MenuItem>
              <MenuItem onClick={handleToggleFavorite}>
                {isFavorite ? (
                  <Favorite sx={{ mr: 1 }} fontSize="small" color="error" />
                ) : (
                  <FavoriteBorder sx={{ mr: 1 }} fontSize="small" />
                )}
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </MenuItem>
            </Menu>
          </Box>
        }
      >
        <ListItemButton
          onClick={handlePlayPause}
          sx={{ 
            py: 1,
            px: 2,
            borderRadius: 2,
            bgcolor: isCurrentSong ? 'action.selected' : 'transparent',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <ListItemAvatar>
            {isCurrentSong ? (
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
              >
                {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
              </IconButton>
            ) : (
              <Avatar 
                variant="rounded" 
                alt={song.title}
                src={song.cover}
                sx={{ width: 40, height: 40 }}
              >
                {index + 1}
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography 
                variant="body1" 
                component="div" 
                sx={{ 
                  fontWeight: isCurrentSong ? 'bold' : 'regular',
                  color: isCurrentSong ? 'primary.main' : 'text.primary'
                }}
              >
                {song.title}
              </Typography>
            }
            secondary={song.artist}
          />
        </ListItemButton>
      </ListItem>
    </motion.div>
  );
};

export default SongItem; 