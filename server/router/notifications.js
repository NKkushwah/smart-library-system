// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications
router.get('/', async (req,res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

// Add notification
router.post('/', async (req,res) => {
  const notification = new Notification(req.body);
  await notification.save();
  res.json(notification);
});

module.exports = router;
