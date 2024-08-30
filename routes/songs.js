const express = require('express');
const path = require('path');
const Song = require('../models/Song');
const router = express.Router();

// Get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    console.error('Error fetching songs:', err.message);
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

// Create a new song
router.post('/', async (req, res) => {
  const { title, artist, album, genre } = req.body;

  const song = new Song({
    title,
    artist,
    album,
    genre,
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (err) {
    console.error('Error creating song:', err.message);
    res.status(400).json({ message: 'Error creating song' });
  }
});

// Update a song
router.put('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    song.title = req.body.title || song.title;
    song.artist = req.body.artist || song.artist;
    song.album = req.body.album || song.album;
    song.genre = req.body.genre || song.genre;

    const updatedSong = await song.save();
    res.json(updatedSong);
  } catch (err) {
    console.error('Error updating song:', err.message);
    res.status(400).json({ message: 'Error updating song' });
  }
});

// Delete a song
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    res.json({ message: 'Song deleted' });
  } catch (err) {
    console.error('Error deleting song:', err.message);
    res.status(500).json({ message: 'Error deleting song' });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Song.distinct('artist').length;
    const totalAlbums = await Song.distinct('album').length;
    const totalGenres = await Song.distinct('genre').length;

    const genreStats = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
    ]);

    const artistStats = await Song.aggregate([
      { $group: { _id: '$artist', songCount: { $sum: 1 } } },
    ]);

    res.json({
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres,
      songsPerGenre: genreStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      songsPerArtist: artistStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.songCount }), {}),
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
