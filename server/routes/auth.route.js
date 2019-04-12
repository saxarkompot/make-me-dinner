var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var db = require('../models/db');
passport.use(new Strategy(
    function (username, password, cb) {
        db.User.find({
                where: {
                    email: username
                }
            })
            .then(user => {
                if (!user) {
                    return cb(null, false);
                }
                if (user.name.toLowerCase() != password.toLowerCase()) {
                    return cb(null, false);
                }
                return cb(null, user);
            }).catch(cb);
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.User.findById(id).then(user => cb(null, user))
        .catch(cb);
});

module.exports = function (app) {
    app.use(require('express-session')({
        secret: 'my-custom-lunch-delivery-key',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.post('/auth', passport.authenticate('local'),
        function (req, res) {
            res.json({});
        });
    app.get('/logout',
        function (req, res) {
            req.logout();
            res.json({});
        });
}