import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { songs } from '../data/songs';
import SongItem from '../components/Library/SongItem';

const Library: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Filter songs based on search query
  const filteredSongs = songs.filter(song => {
    const query = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query)
    );
  });
  
  // Sort songs based on selected tab
  let sortedSongs = [...filteredSongs];
  
  if (tabValue === 0) {
    // Recently Added - keep as is (assuming newest first)
  } else if (tabValue === 1) {
    // Sort by title
    sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (tabValue === 2) {
    // Sort by artist
    sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
  }
  
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Your Library
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Browse and play your favorite tracks
          </Typography>
        </Box>
        
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search songs, artists, or albums"
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
        
        {/* Tabs */}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="Recently Added" />
            <Tab label="Title" />
            <Tab label="Artist" />
          </Tabs>
        </Box>
        
        {/* Song List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {sortedSongs.length > 0 ? (
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              {sortedSongs.map((song, index) => (
                <SongItem key={song.id} song={song} index={index} />
              ))}
            </Paper>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No songs found matching "{searchQuery}"
              </Typography>
            </Box>
          )}
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Library; 