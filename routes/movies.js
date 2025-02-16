const router = require('express').Router();
const Movie = require('../models/Movie');
const verify = require('../verifyToken');

// Create
router.post('/', verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      res.status(201).json(savedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Not authorized to create movies');
  }
});

// Update
router.put('/:id', verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedMovie);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Not authorized to update movies');
  }
});

// Delete
router.delete('/:id', verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      res.status(200).json('Movie deleted successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('Not authorized to delete movies');
  }
});

// Get
router.get('/find/:id', verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get random
router.get('/random', verify, async (req, res) => {
  const type = req.query.type;
  const genre = req.query.genre;
  let movie;
  try {
    if (type === 'series') {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    }
    else if (type === 'movie') {
      const matchCondition = {
        isSeries: false,
        ...(genre ? { genre: genre } : {}) // Thêm điều kiện genre nếu genre có giá trị
      };

      movie = await Movie.aggregate([
        { $match: matchCondition },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    console.log('Type:', type);
    console.log('Genre:', genre);
    console.log('Movies:', movie);
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all
router.get('/', verify, async (req, res) => {
  const query = req.query.new;
  const type = req.query.type;
  console.log(type + "===========================")
  const genre = req.query.genre;
  if (req.user.isAdmin) {
    try {
      const movies = query
        ? await Movie.find().sort({ _id: -1 }).limit(5)
        : await Movie.find();
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    try {
      const movies = type === "movie"
        ? genre
          ? await Movie.aggregate([
            { $match: { genre: genre, isSeries: false } },
            { $sample: { size: 10 } }
          ])
          : await Movie.aggregate([
            { $match: { isSeries: false } },
            { $sample: { size: 10 } }
          ])
        : type === "series"
          ? genre
            ? await Movie.aggregate([
              { $match: { genre: genre, isSeries: false } },
              { $sample: { size: 10 } }
            ])
            : await Movie.aggregate([
              { $match: { isSeries: false } },
              { $sample: { size: 10 } }
            ])
          : await Movie.find().limit(5)
      res.status(200).json(movies.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
    // res.status(403).json('Not authorized to view all movies');
  }
});

module.exports = router;
