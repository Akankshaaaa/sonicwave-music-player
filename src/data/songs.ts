import { Song, Album, Artist } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Song data
export const songs: Song[] = [
  {
    id: uuidv4(),
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    duration: 267,
    path: '/audio/Coldplay - Yellow.mp3',
    cover: 'https://www.udiscovermusic.com/wp-content/uploads/2017/02/Coldplay-Parachutes-album-cover-web-optimised-820-2048x2048.jpg'
  },
  {
    id: uuidv4(),
    title: 'Paradise',
    artist: 'Coldplay',
    album: 'Mylo Xyloto',
    duration: 365,
    path: '/audio/Coldplay - Paradise.mp3',
    cover: 'https://www.therevolverclub.com/cdn/shop/files/CS687207-01A-BIG.jpg'
  },
  {
    id: uuidv4(),
    title: 'Hymn For The Weekend',
    artist: 'Coldplay',
    album: 'A Head Full of Dreams',
    duration: 258,
    path: '/audio/Coldplay - Hymn For The Weekend.mp3',
    cover: 'https://m.media-amazon.com/images/I/A1p7bWyAvmL._SL1500_.jpg'
  },
  {
    id: uuidv4(),
    title: 'A Sky Full Of Stars',
    artist: 'Coldplay',
    album: 'Ghost Stories',
    duration: 242,
    path: '/audio/Coldplay - A Sky Full Of Stars.mp3',
    cover: 'https://m.media-amazon.com/images/I/81Qsqw+lbwL._SL1425_.jpg'
  },
  // Adding Ed Sheeran songs
  {
    id: uuidv4(),
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 234,
    path: '/audio/Ed Sheeran - Shape of You.mp3',
    cover: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Shape_Of_You_%28Official_Single_Cover%29_by_Ed_Sheeran.png'
  },
  {
    id: uuidv4(),
    title: 'Thinking Out Loud',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    duration: 281,
    path: '/audio/Ed Sheeran - Thinking Out Loud.mp3',
    cover: 'https://upload.wikimedia.org/wikipedia/en/a/ad/X_cover.png'
  },
  {
    id: uuidv4(),
    title: 'Photograph',
    artist: 'Ed Sheeran',
    album: 'x (Multiply)',
    duration: 258,
    path: '/audio/Ed Sheeran - Photograph.mp3',
    cover: 'https://upload.wikimedia.org/wikipedia/en/a/ad/X_cover.png'
  }
];

// Album data
export const albums: Album[] = [
  {
    id: uuidv4(),
    title: 'Parachutes',
    artist: 'Coldplay',
    cover: 'https://www.udiscovermusic.com/wp-content/uploads/2017/02/Coldplay-Parachutes-album-cover-web-optimised-820-2048x2048.jpg',
    songs: songs.filter(song => song.album === 'Parachutes')
  },
  {
    id: uuidv4(),
    title: 'Mylo Xyloto',
    artist: 'Coldplay',
    cover: 'https://www.therevolverclub.com/cdn/shop/files/CS687207-01A-BIG.jpg',
    songs: songs.filter(song => song.album === 'Mylo Xyloto')
  },
  {
    id: uuidv4(),
    title: 'A Head Full of Dreams',
    artist: 'Coldplay',
    cover: 'https://m.media-amazon.com/images/I/A1p7bWyAvmL._SL1500_.jpg',
    songs: songs.filter(song => song.album === 'A Head Full of Dreams')
  },
  {
    id: uuidv4(),
    title: 'Ghost Stories',
    artist: 'Coldplay',
    cover: 'https://m.media-amazon.com/images/I/81Qsqw+lbwL._SL1425_.jpg',
    songs: songs.filter(song => song.album === 'Ghost Stories')
  },
  // Adding Ed Sheeran albums
  {
    id: uuidv4(),
    title: '÷ (Divide)',
    artist: 'Ed Sheeran',
    cover: 'https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png',
    songs: songs.filter(song => song.album === '÷ (Divide)')
  },
  {
    id: uuidv4(),
    title: 'x (Multiply)',
    artist: 'Ed Sheeran',
    cover: 'https://upload.wikimedia.org/wikipedia/en/a/ad/X_cover.png',
    songs: songs.filter(song => song.album === 'x (Multiply)')
  }
];

// Artist data
export const artists: Artist[] = [
  {
    id: uuidv4(),
    name: 'Coldplay',
    image: 'https://bookingagentinfo.com/wp-content/uploads/2025/04/ab6761610000e5eb1ba8fc5f5c73e7e9313cc6eb-1.jpg',
    albums: albums.filter(album => album.artist === 'Coldplay')
  },
  {
    id: uuidv4(),
    name: 'Ed Sheeran',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Ed_Sheeran-6886_%28cropped%29.jpg',
    albums: albums.filter(album => album.artist === 'Ed Sheeran')
  }
]; 