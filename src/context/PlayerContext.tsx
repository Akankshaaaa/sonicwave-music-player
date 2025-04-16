import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Song } from '../models/types';

interface PlayerContextProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  repeatMode: 'off' | 'all' | 'one';
  isShuffled: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setProgress: (value: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  songQueue: Song[];
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  favoriteSongs: Song[];
  isSongFavorite: (songId: string) => boolean;
  toggleFavorite: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextProps | null>(null);

export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: React.ReactNode;
  initialSongs: Song[];
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children, initialSongs }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [songQueue, setSongQueue] = useState<Song[]>([]);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [audioIsReady, setAudioIsReady] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  
  // Load favorites from localStorage
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('favoriteSongs');
      if (storedFavorites) {
        setFavoriteSongs(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, [favoriteSongs]);
  
  // Save initialSongs to localStorage for shuffle access
  useEffect(() => {
    try {
      localStorage.setItem('songs', JSON.stringify(initialSongs));
    } catch (error) {
      console.error('Failed to save songs to localStorage:', error);
    }
  }, [initialSongs]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.volume = volume;
      
      // Add event listeners for audio readiness
      audio.addEventListener('canplay', () => {
        setAudioIsReady(true);
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setAudioIsReady(false);
        setIsPlaying(false);
      });
      
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.remove();
        audioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    // Only update source if it's different
    if (audioRef.current.src !== new URL(currentSong.path, window.location.origin).href) {
      setAudioIsReady(false);
      audioRef.current.src = currentSong.path;
      audioRef.current.load();
    }
    
    const playAudio = async () => {
      if (isPlaying && audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        }
      }
    };
    
    if (audioIsReady) {
      playAudio();
    }
    
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentSong, isPlaying, audioIsReady]);

  // Update progress and handle song end
  useEffect(() => {
    if (!audioRef.current) return;
    
    const updateProgress = () => {
      if (audioRef.current) {
        const calculatedProgress = 
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(calculatedProgress || 0);
      }
    };
    
    const handleEnded = () => {
      if (repeatMode === 'one') {
        // For single-song repeat, restart the song
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => {
            console.error('Error replaying audio:', error);
          });
        }
      } else if (songQueue.length > 0 || repeatMode === 'all') {
        // Go to next song for queue or all-repeat
        nextSong();
      } else {
        // Otherwise just stop
        setIsPlaying(false);
        setProgress(0);
      }
    };
    
    const handleCanPlayThrough = () => {
      setAudioIsReady(true);
      if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    };
    
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songQueue, repeatMode, isPlaying]);

  // Apply repeat mode to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = repeatMode === 'one';
    }
  }, [repeatMode]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song: Song) => {
    if (currentSong && currentSong.id === song.id) {
      // If the same song is already loaded, just resume
      resumeSong();
    } else {
      // Load and play a new song
      setCurrentSong(song);
      setProgress(0);
      setAudioIsReady(false);
      setIsPlaying(true);
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const resumeSong = () => {
    if (currentSong) {
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    if (songQueue.length > 0) {
      // If we have songs in the queue, play the next one
      const newQueue = [...songQueue];
      const nextSong = newQueue.shift();
      setSongQueue(newQueue);
      if (nextSong) {
        playSong(nextSong);
      }
    } else if (currentSong) {
      // Find current song index
      const currentIndex = initialSongs.findIndex(song => song.id === currentSong.id);
      
      // Handle repeat all
      if (repeatMode === 'all' && currentIndex === initialSongs.length - 1) {
        // If at the end of the playlist and repeat all is on, go back to first song
        playSong(initialSongs[0]);
      } else if (currentIndex < initialSongs.length - 1) {
        // Otherwise just go to next song if available
        playSong(initialSongs[currentIndex + 1]);
      }
    }
  };

  const previousSong = () => {
    // Reset current song if already playing for more than 3 seconds
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    if (currentSong) {
      // Find current song index
      const currentIndex = initialSongs.findIndex(song => song.id === currentSong.id);
      
      // Check if we're at the beginning and repeat all is enabled
      if (repeatMode === 'all' && currentIndex === 0) {
        // Go to last song
        playSong(initialSongs[initialSongs.length - 1]);
      } else if (currentIndex > 0) {
        // Otherwise go to previous song if available
        playSong(initialSongs[currentIndex - 1]);
      }
    }
  };

  const handleSetProgress = (value: number) => {
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  const handleSetVolume = (value: number) => {
    // Clamp the value between 0 and 1 to ensure valid volume
    const clampedValue = Math.max(0, Math.min(1, value));
    
    // Update the audio element volume immediately to ensure responsive volume control
    if (audioRef.current) {
      // For iOS, need to unlock audio first with user interaction
      const unlockIOSAudio = () => {
        if (audioRef.current) {
          // Create short silent sound to unlock audio
          audioRef.current.volume = 0;
          audioRef.current.play().then(() => {
            // Once unlocked, we can set the actual volume and pause if needed
            audioRef.current!.pause();
            audioRef.current!.volume = clampedValue;
            if (isPlaying) {
              audioRef.current!.play().catch(err => console.error('Error playing audio:', err));
            }
          }).catch(err => {
            console.warn('Could not unlock iOS audio:', err);
            // Still set the volume
            if (audioRef.current) {
              audioRef.current.volume = clampedValue;
            }
          });
        }
      };
      
      // Check if we need to handle iOS specifically
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
        unlockIOSAudio();
      } else {
        // For other devices, just set the volume directly
        audioRef.current.volume = clampedValue;
      }
    }
    
    // Update the state after the direct manipulation
    setVolume(clampedValue);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      handleSetVolume(0); // Use the enhanced volume setter
    } else {
      handleSetVolume(previousVolume); // Use the enhanced volume setter
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    
    if (!isShuffled) {
      // If enabling shuffle, randomize the queue
      const availableSongs = initialSongs.filter(song => song.id !== currentSong?.id);
      const shuffledSongs = [...availableSongs].sort(() => Math.random() - 0.5);
      
      // Replace the current queue with shuffled songs
      setSongQueue(shuffledSongs);
    } else {
      // If disabling shuffle, clear the queue (or could restore original order)
      setSongQueue([]);
    }
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const addToQueue = (song: Song) => {
    setSongQueue(prev => [...prev, song]);
  };

  const removeFromQueue = (songId: string) => {
    setSongQueue(prev => prev.filter(song => song.id !== songId));
  };

  // Add these new functions for favorite songs
  const isSongFavorite = (songId: string): boolean => {
    return favoriteSongs.some(song => song.id === songId);
  };
  
  const toggleFavorite = (song: Song) => {
    if (isSongFavorite(song.id)) {
      // Remove from favorites
      setFavoriteSongs(prev => prev.filter(favSong => favSong.id !== song.id));
    } else {
      // Add to favorites
      setFavoriteSongs(prev => [...prev, song]);
    }
  };

  const value = {
    currentSong,
    isPlaying,
    progress,
    volume,
    repeatMode,
    isShuffled,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    previousSong,
    setProgress: handleSetProgress,
    setVolume: handleSetVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    songQueue,
    addToQueue,
    removeFromQueue,
    favoriteSongs,
    isSongFavorite,
    toggleFavorite,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}; 