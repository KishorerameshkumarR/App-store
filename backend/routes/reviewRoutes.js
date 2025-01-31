const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all reviews for an app
router.get('/:appId', async (req, res) => {
    try {
        const reviews = await Review.find({ appId: req.params.appId })
            .sort({ createdAt: -1 });
        
        console.log('Fetched reviews:', reviews); // Debug log
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

// Create a review
router.post('/:appId', async (req, res) => {
    try {
        const { content, rating, userId, userName } = req.body;
        
        console.log('Creating review with data:', { // Debug log
            content,
            rating,
            userId,
            userName,
            appId: req.params.appId
        });

        const review = await Review.create({
            content,
            rating,
            userId,
            userName,
            appId: req.params.appId
        });

        console.log('Created review:', review); // Debug log
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
});

// Update a review
router.put('/:id', async (req, res) => {
    try {
        const { content, rating, userId } = req.body;
        
        console.log('Updating review:', req.params.id, { content, rating }); // Debug log
        
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (review.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this review' });
        }
        
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { content, rating },
            { new: true }
        );

        console.log('Updated review:', updatedReview); // Debug log
        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
});

// Delete a review
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting review:', req.params.id); // Debug log
        
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        
        if (review.userId !== req.query.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        
        await Review.findByIdAndDelete(req.params.id);
        console.log('Review deleted successfully'); // Debug log
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
});

module.exports = router;
