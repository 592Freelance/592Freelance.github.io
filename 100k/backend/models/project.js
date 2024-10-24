const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  messages: [{ 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Project', projectSchema);
