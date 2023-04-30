const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('./models/user')


// Configure the local strategy for use by Passport.

module.exports = function initialize(passport) {
  passport.use(new LocalStrategy({usernameField: 'login', passwordField: 'password'}, async (login, password, done) => {
    const user = await User.findOne({ login: login }) 
      if (!user) { 
        return done(null, false, { message: 'No user found' })
      }
 
      try {
        if ( await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Incorrect password'})
        }
      } catch (error) {
        return done(error)
      }

  }))
}



// Serialize the user for the session.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// Deserialize the user from the session.
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

