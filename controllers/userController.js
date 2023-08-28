const passport = require('passport');
const User = require('../models/user');

exports.signupGet = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
};

exports.signupPost = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = new User({ firstName, lastName, email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
};

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