import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme/theme';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Library from './pages/Library';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import FullPlayer from './components/Player/FullPlayer';
import { PlayerProvider } from './context/PlayerContext';
import { songs } from './data/songs';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PlayerProvider initialSongs={songs}>
        <Router>
          <Routes>
            <Route path="/player" element={<FullPlayer />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<Library />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/albums/:id" element={<AlbumDetail />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artists/:id" element={<ArtistDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/search" element={<Search />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
