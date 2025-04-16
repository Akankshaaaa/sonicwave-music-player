import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Album } from '../../models/types';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        boxShadow: `0 8px 30px ${theme.palette.primary.main}33`,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      style={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Card 
        component={Link}
        to={`/albums/${album.id}`}
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          textDecoration: 'none',
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          position: 'relative', 
          paddingTop: '100%', /* 1:1 Aspect ratio */
          width: '100%', 
          overflow: 'hidden',
          flexShrink: 0 // Prevent the image from shrinking
        }}>
          <CardMedia
            component="img"
            image={album.cover}
            alt={album.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        </Box>
        <CardContent sx={{ 
          flexGrow: 1, 
          p: 2,
          minHeight: '100px', // Changed from fixed height to minimum height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          overflow: 'hidden' // Ensure content stays contained
        }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2, // Show up to 2 lines
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            {album.title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {album.artist}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {album.songs.length} {album.songs.length === 1 ? 'song' : 'songs'}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AlbumCard; 