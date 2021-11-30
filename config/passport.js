const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// Reference to the Users model where auth will be made
const Users = require('../models/Users');

// local strategy: login with own credentials (user and password)
passport.use(
    new localStrategy(
        // by default passport look for an username and password, but we can rewrite that
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {

            const credentials = { email, password };
            try {
                const user = await Users.findOne({
                    where: { email }
                })
                // if the account is not active
                if( !user.active ) {
                    return done(null, false, {
                        message: 'La Cuenta no ha sido activada, revise la bandeja de entrada de su correo'
                    })
                }
                // the email exist, but is a wrong password
                if (!user.passwordVerify(password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto.'
                    })
                }
                // Email exist and password is correct
                return done(null, user);
            } catch (error) {
                // The user does not exist
                return done(null, false, {
                    message: 'Esta email no existe.'
                })
            }
        }
    )
);

// Serialize the user
passport.serializeUser((user, callback) => {
    callback(null, user);
});

// Deserialize the user
passport.deserializeUser((user, callback) => {
    callback(null, user);
});

module.exports = passport;