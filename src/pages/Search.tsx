import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Paper,
  Tabs,
  Tab,
  useTheme,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Clear, MusicNote, Album as AlbumIcon, Person } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { songs, albums, artists } from '../data/songs';
import SongItem from '../components/Library/SongItem';
import AlbumCard from '../components/Albums/AlbumCard';
import { Link } from 'react-router-dom';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const theme = useTheme();
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Simulate search delay for better UX
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);
  
  // Filter songs based on search query
  const filteredSongs = songs.filter(song => {
    const query = searchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query)
    );
  });
  
  // Filter albums based on search query
  const filteredAlbums = albums.filter(album => {
    const query = searchQuery.toLowerCase();
    return (
      album.title.toLowerCase().includes(query) ||
      album.artist.toLowerCase().includes(query)
    );
  });
  
  // Filter artists based on search query
  const filteredArtists = artists.filter(artist => {
    const query = searchQuery.toLowerCase();
    return artist.name.toLowerCase().includes(query);
  });
  
  // Get all results count
  const totalResults = filteredSongs.length + filteredAlbums.length + filteredArtists.length;
  
  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Search
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Find your favorite music
          </Typography>
        </Box>
        
        {/* Enhanced Search Bar */}
        <Paper 
          elevation={4} 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 8px 32px ${theme.palette.primary.main}33`,
            }
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                padding: '12px',
                fontSize: '1.1rem',
                '& fieldset': {
                  border: 'none',
                }
              },
              '& .MuiOutlinedInput-input': {
                paddingLeft: 1
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" fontSize="large" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  {isSearching ? (
                    <CircularProgress size={24} color="primary" />
                  ) : (
                    <IconButton onClick={clearSearch} size="medium">
                      <Clear fontSize="medium" />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Paper>
        
        {/* Show search results only if there's a search query */}
        {searchQuery && (
          <>
            {/* Results Summary */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {isSearching ? 'Searching...' : `Found ${totalResults} results for "${searchQuery}"`}
              </Typography>
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
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MusicNote fontSize="small" />
                      <Typography>Songs ({filteredSongs.length})</Typography>
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AlbumIcon fontSize="small" />
                      <Typography>Albums ({filteredAlbums.length})</Typography>
                    </Box>
                  } 
                />
                <Tab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      <Typography>Artists ({filteredArtists.length})</Typography>
                    </Box>
                  } 
                />
              </Tabs>
            </Box>
            
            {/* Results */}
            <AnimatePresence mode="wait">
              {/* Songs Tab */}
              {tabValue === 0 && (
                <motion.div
                  key="songs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredSongs.length > 0 ? (
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                      {filteredSongs.map((song, index) => (
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
              )}
              
              {/* Albums Tab */}
              {tabValue === 1 && (
                <motion.div
                  key="albums"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredAlbums.length > 0 ? (
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { 
                        xs: 'repeat(2, 1fr)', 
                        sm: 'repeat(3, 1fr)', 
                        md: 'repeat(4, 1fr)', 
                        lg: 'repeat(5, 1fr)' 
                      }, 
                      gap: 3 
                    }}>
                      {filteredAlbums.map((album, index) => (
                        <motion.div
                          key={album.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
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
              )}
              
              {/* Artists Tab */}
              {tabValue === 2 && (
                <motion.div
                  key="artists"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
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
                          transition={{ delay: index * 0.05 }}
                        >
                          <Paper
                            elevation={3}
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
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: `0 12px 40px ${theme.palette.primary.main}33`,
                              },
                            }}
                          >
                            <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden' }}>
                              <Box
                                component="img"
                                src={artist.image}
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
                            <Box sx={{ p: 2, flexGrow: 1 }}>
                              <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                {artist.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {artist.albums.length} {artist.albums.length === 1 ? 'album' : 'albums'}
                              </Typography>
                            </Box>
                          </Paper>
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
              )}
            </AnimatePresence>
          </>
        )}
        
        {/* Welcome message when no search is performed */}
        {!searchQuery && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 10, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Box 
              sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <SearchIcon sx={{ fontSize: 60, color: theme.palette.primary.main, opacity: 0.8 }} />
            </Box>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Start typing to search
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
              Search across all your songs, albums, and artists to find exactly what you're looking for.
            </Typography>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default Search; 