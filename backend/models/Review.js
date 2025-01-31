const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Review content is required'],
        trim: true,
        maxlength: [500, 'Review content cannot be more than 500 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    userName: {
        type: String,
        required: [true, 'User name is required']
    },
    appId: {
        type: String,
        required: [true, 'App ID is required']
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
reviewSchema.index({ appId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
