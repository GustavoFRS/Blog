const express = require('express')
const User = require('./../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./../passport-config')
initializePassport(passport)
router = express.Router()


router.get('/register', notAuthCheck, (req, res) => {
    res.render('users/register', { user: new User(), messages: req.flash() })
})

router.post('/register', notAuthCheck, async (req, res) => {
    
    try {
        const {login, password} = req.body;

        if (await User.findOne({ login })) {
            req.flash('error', 'User already exists')
            res.redirect('/users/register')
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10) 
        const user = new User({
            login: login,
            password: hashedPassword
        })

        await user.save();

        req.flash('success', 'You are now registered!')
        res.redirect('/users/login')
    } catch (error) {
        console.log(error);
        res.redirect('/users/register')
    }
})

router.get('/login', notAuthCheck, (req, res) => {
    res.render('./users/login', { messages: req.flash() })
})

router.post('/login', notAuthCheck, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.delete('/logout', authCheck, (req, res, next) => {
    req.logOut()
    res.redirect('./users/login')
})


function authCheck(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/')
}


function notAuthCheck(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()    
}


module.exports = router