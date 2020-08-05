const express = require('express');

const emojis = require('./emojis');

const crud = require('./crud');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/emojis', emojis);
router.use('/crud', crud);

module.exports = router;
