const express = require('express');
const router = express.Router();

// Sample apps data (in a real app, this would come from MongoDB)
const sampleApps = [
    {
        _id: '1',
        name: 'Sample Game',
        developer: 'Game Studio',
        category: 'games',
        rating: 4.5,
        icon: '/logo.webp',
        description: 'An exciting sample game'
    },
    {
        _id: '2',
        name: 'Productivity App',
        developer: 'Tech Corp',
        category: 'apps',
        rating: 4.2,
        icon: '/logo.webp',
        description: 'Boost your productivity'
    },
    {
        _id: '3',
        name: 'Sample Book',
        developer: 'Publisher Inc',
        category: 'books',
        rating: 4.7,
        icon: '/logo.webp',
        description: 'An interesting book to read'
    }
];

// Get all apps with optional category filter
router.get('/', (req, res) => {
    const { category } = req.query;
    if (category && category !== 'all') {
        const filteredApps = sampleApps.filter(app => app.category === category);
        res.json(filteredApps);
    } else {
        res.json(sampleApps);
    }
});

// Get single app by ID
router.get('/:id', (req, res) => {
    const app = sampleApps.find(app => app._id === req.params.id);
    if (app) {
        res.json(app);
    } else {
        res.status(404).json({ message: 'App not found' });
    }
});

module.exports = router;
