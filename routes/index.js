var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');
const userController = require('../controllers/userController');
const Message = require('../models/message');

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const user = req.user;

  let messages = [];
  if (isAuthenticated) {
    messages = await Message.find().populate('author');
  }

  res.render('index', { title: 'Antartic Base', isAuthenticated, user, messages });
}));

router.get('/join', userController.joinGet);
router.post('/join', userController.joinPost);

module.exports = router;
