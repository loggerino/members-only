const passport = require('passport');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.signupGet = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
};

exports.signupPost = asyncHandler(async (req, res, next) => {
    try {
        await body('firstName').trim().notEmpty().withMessage('First name is required.').run(req);
        await body('lastName').trim().notEmpty().withMessage('Last name is required.').run(req);
        await body('email').trim().isEmail().withMessage('Invalid email address.').run(req);
        await body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/auth/signup');
        }

        const { firstName, lastName, email, password } = req.body;
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
});

exports.loginGet = (req, res) => {
    res.render('login', { title: 'Log In' });
};

exports.loginPost = (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        req.flash('error', 'Incorrect email or password.');
        res.redirect('/auth/login');
    }
};

exports.logoutGet = (req, res) => {
    res.render('logout', { title: 'Logout' });
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};
