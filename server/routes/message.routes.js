const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../models/Messages');

// ✅ POST new message and get AI reply
router.post('/', async (req, res) => {
  try {
    const userText = req.body.content;

    // Save user's message to DB
    const newMsg = new Message(req.body);
    await newMsg.save();

    // OpenRouter request
   const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: "openai/gpt-3.5-turbo", // ✅ Working model
    messages: [
      { role: "user", content: userText }
    ]
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);


    const botText = response.data.choices[0].message.content;

    // Save bot reply to DB
    const botMsg = new Message({ sender: "Bot", content: botText });
    await botMsg.save();

    // Send both back to frontend
    res.json([newMsg, botMsg]);

  } catch (err) {
    console.error("❌ OpenRouter error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Bot failed to respond via OpenRouter' });
  }
});

// ✅ GET all messages
router.get('/', async (req, res) => {
  try {
    const msgs = await Message.find();
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ DELETE all messages
router.delete('/', async (req, res) => {
  try {
    await Message.deleteMany({});
    res.json({ message: 'All messages deleted ✅' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete messages ❌' });
  }
});

module.exports = router;
