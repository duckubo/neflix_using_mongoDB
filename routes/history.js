const router = require('express').Router();
const History = require('../models/History');
const Movie = require('../models/Movie');
const verify = require('../verifyToken');
const mongoose = require('mongoose');
// Create
router.post('/watch', verify, async (req, res) => {
    const { userId, movieId, watchTime } = req.body;

    try {
        // Tìm bản ghi lịch sử xem với userId và movieId
        let historyEntry = await History.findOne({ userId, movieId });

        if (historyEntry) {
            // Nếu đã tồn tại, cập nhật thời gian đã xem
            historyEntry.watchTime = watchTime; // Cập nhật watchTime
            await historyEntry.save(); // Lưu thay đổi
            return res.status(200).json({ message: 'History updated', historyEntry });
        } else {
            // Nếu chưa tồn tại, tạo bản ghi mới
            historyEntry = new History({ userId, movieId, watchTime });
            await historyEntry.save();
            return res.status(201).json({ message: 'History created', historyEntry });
        }
    } catch (error) {
        console.error('Error saving or updating watch history:', error);
        res.status(500).json({ error: 'Internal server error' });
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
        const history = await History.findById(req.params.id);
        res.status(200).json(history);
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
    try {
        const userId = req.headers['userid'] // Lọc theo userId nếu có trong query
        try {
            const query = userId ? { userId: userId } : {};
            const history = await History.find({ query });
            console.log(history);

            res.status(200).json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Lỗi khi lấy lịch sử xem' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
