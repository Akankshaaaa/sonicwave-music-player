import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { albums } from '../data/songs';
import AlbumCard from '../components/Albums/AlbumCard';

const Albums: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Filter albums based on search query
  const filteredAlbums = albums.filter(album => {
    const query = searchQuery.toLowerCase();
    return (
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query)
    );
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
            Albums
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Browse your album collection
          </Typography>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search albums"
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
        
        {/* Albums Grid */}
        {filteredAlbums.length > 0 ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)', 
              md: 'repeat(4, 1fr)', 
              lg: 'repeat(5, 1fr)' 
            }, 
            gap: { xs: 2, sm: 3 },
            '& > div': {
              width: '100%',
              height: '100%'
            }
          }}>
            {filteredAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ width: '100%' }}
              >
                <AlbumCard album={album} />
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No albums found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default Albums; 