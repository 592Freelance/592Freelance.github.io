const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bid = require('../models/Bid');
const Job = require('../models/Job');

// Submit a new bid
router.post('/', auth, async (req, res) => {
  try {
    const { jobId, amount, proposal } = req.body;

    const newBid = new Bid({
      job: jobId,
      freelancer: req.user.id,
      amount,
      proposal
    });

    const bid = await newBid.save();

    // Emit a 'newBid' event to all connected clients
    req.io.emit('newBid', { jobId, bid });

    res.json(bid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ... other routes ...

module.exports = router;
