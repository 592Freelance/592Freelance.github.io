// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    skills: [String],
    postedBy: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);

// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const jobs = await Job.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { skills: { $in: [new RegExp(query, 'i')] } }
            ]
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jobRoutes = require('./routes/jobs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/freelance_hub', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.use('/api/jobs', jobRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// backend/package.json
{
  "name": "freelance-hub-backend",
  "version": "1.0.0",
  "description": "Backend for Freelance Hub",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^5.12.3",
    "body-parser": "^1.19.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  }
}



