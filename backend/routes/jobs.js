const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// Create a new job (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;

    const newJob = new Job({
      title,
      description,
      budget,
      deadline,
      client: req.user.id
    });

    const job = await newJob.save();

    // Emit a 'newJob' event to all connected clients
    req.io.emit('newJob', job);

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... other routes ...

module.exports = router;
