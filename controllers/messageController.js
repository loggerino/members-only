const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Message = require('../models/message');

exports.createMessageGet = (req, res) => {
    res.render('create-message', { title: 'Create a New Message' });
}

exports.createMessagePost = [
    body('title').trim().isLength({ min: 1 }).withMessage('Title must not be empty.'),
    body('text').trim().isLength({ min: 1 }).withMessage('Message text must not be empty.'),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const author = req.user._id;
        const message = new Message({
            title: req.body.title,
            text: req.body.text,
            author: author,
        });
        if (!errors.isEmpty()) {
            res.render('create-message', {
                title: 'Create a New Message',
                message: message,
                errors: errors.array(),
            });
            return;
        } else {
            await message.save();
            res.redirect('/');
        }
    })
]