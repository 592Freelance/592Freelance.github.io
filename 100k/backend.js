const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['freelancer', 'client'], required: true },
  profile: {
    name: String,
    skills: [String],
    bio: String
  }
});

const User = mongoose.model('User', UserSchema);

// Job model
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' }
});

const Job = mongoose.model('Job', JobSchema);

// Bid model
const BidSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  proposal: { type: String, required: true }
});

const Bid = mongoose.model('Bid', BidSchema);

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, userType });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Create job posting
app.post('/api/jobs', authenticateJWT, async (req, res) => {
  try {
    const { title, description, budget } = req.body;
    const job = new Job({ title, description, budget, clientId: req.user.userId });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// Submit bid
app.post('/api/bids', authenticateJWT, async (req, res) => {
  try {
    const { jobId, amount, proposal } = req.body;
    const bid = new Bid({ jobId, freelancerId: req.user.userId, amount, proposal });
    await bid.save();
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit bid' });
  }
});

// Get job details with bids
app.get('/api/jobs/:jobId', authenticateJWT, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const bids = await Bid.find({ jobId: job._id }).populate('freelancerId', 'username');
    res.json({ job, bids });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
});

// Update job status
app.patch('/api/jobs/:jobId', authenticateJWT, async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.jobId, clientId: req.user.userId },
      { status },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// Process payment
app.post('/api/payments', authenticateJWT, async (req, res) => {
  try {
    const { amount, token } = req.body;
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      source: token,
      description: 'Payment for freelance job'
    });
    res.json({ message: 'Payment processed successfully', charge });
  } catch (error) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
