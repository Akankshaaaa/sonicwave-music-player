import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Card, 
  CardMedia, 
  CardContent 
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { artists } from '../data/songs';
import { Link } from 'react-router-dom';

const Artists: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Filter artists based on search query
  const filteredArtists = artists.filter(artist => {
    const query = searchQuery.toLowerCase();
    return artist.name.toLowerCase().includes(query);
  });
  
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Artists
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Browse by artist
          </Typography>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search artists"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        {/* Artists Grid */}
        {filteredArtists.length > 0 ? (
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
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  component={Link}
                  to={`/artists/${artist.id}`}
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    textDecoration: 'none',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={artist.image}
                      alt={artist.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {artist.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {artist.albums.length} {artist.albums.length === 1 ? 'album' : 'albums'}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No artists found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default Artists; 