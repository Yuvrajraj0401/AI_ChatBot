const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});

module.exports = mongoose.model('Message', messageSchema);
