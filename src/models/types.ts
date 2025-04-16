export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  path: string;
  cover: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  cover: string;
  songs: Song[];
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  albums: Album[];
}

export interface PlaybackState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
} 