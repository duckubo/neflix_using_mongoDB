const mongoose = require('mongoose');

// Định nghĩa Schema cho lịch sử xem
const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Tham chiếu đến model người dùng (nếu bạn có)
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Movie' // Tham chiếu đến model phim (nếu bạn có)
    },
    watchTime: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now, // Thời gian mặc định là thời gian hiện tại
    }
});

// Tạo model từ Schema
const History = mongoose.model('History', historySchema);

module.exports = History;
