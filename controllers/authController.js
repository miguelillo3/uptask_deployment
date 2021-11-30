const passport = require('passport');
const Users = require('../models/Users');
const crypto = require('crypto');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const sendEmail = require('../handlers/email');

exports.userAuth = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion/',
    failureFlash: true,
    badRequestMessage: 'Ambos datos son obligatorios'
});

exports.userIsAuth = (req, res, next) => {
    // Verify is the user is authenticated. If is it, continue
    if (req.isAuthenticated()) {
        return next();
    }
    //If is not authenticated redirect ro '/iniciar-sesion
    return res.redirect('/iniciar-sesion');

}

// close the user session
exports.closeSession = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

// If the email is valid, send the token
exports.sendToken = async (req, res) => {
    const { email } = req.body;// Verify if the email exists
    const user = await Users.findOne({ where: { email } });
    if (!user) {
        // if email not exists
        req.flash('error', 'Este Email no existe');
        res.redirect(`/restablecer?email=${email}`);
    }

    // This way the email exists, so generate token and expiration
    user.token = crypto.randomBytes(20).toString('hex');
    user.expiration = Date.now() + 3600000;
    await user.save();
    // Generate the reset url and redirect
    const resetUrl = `http://${req.headers.host}/restablecer/${user.token}`;

    // Send email within token to user to reset password
    await sendEmail.send({
        user,
        subject: "Restablecer Contraseña",
        resetUrl,
        file: 'resetPass'
    });
    req.flash('correcto', 'Se ha enviado un mensaje a tu correo para modificar la Contraseña')
    res.redirect('/iniciar-sesion');
}

exports.resetPassword = async (req, res) => {
    // Verify that token exist
    const user = await Users.findOne({ where: { token: req.params.token } });
    if (!user) {
        req.flash('error', 'Token No Válido');
        res.redirect('/restablecer');
    }
    //If the token exist show the form to reset password
    res.render('resetPassForm', {
        pageName: 'Restablecer Contraseña'
    });

}

// Function to change password efectively
exports.changePassword = async (req, res) => {
    // Verify again that token exist and verify has not expired
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiration: {
                [Op.gte]: Date.now()
            }
        }
    });
    if (!user) {
        req.flash('error', 'El Token ha Expirado, debe hacer de nuevo la solicitud ');
        res.redirect('/restablecer');
    }
    //If the token exist and has not expired has to make the changes
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expiration = null;
    await user.save();

    // redirect to iniciar-sesion
    req.flash('correcto', 'Contraseña modificada satisfactoriamente');
    res.redirect('/iniciar-sesion');
}

exports.activateAccount = async (req, res) => {
    // Verify the token
    const user = await Users.findOne({
        where: {
            token: req.params.token,
        }
    });
    if (!user) {
        req.flash('error', 'Token Inválido');
        res.redirect('/iniciar-sesion');
    }
    // Verify the expiration
    if( user.expiration < Date.now() ) {
        await user.destroy();
        req.flash('error', 'El Token ha Expirado, debe hacer de nuevo la solicitud ');
        res.redirect('/crear-cuenta');
    }
    //If the token exist and has not expired then activate the account
    user.active = 1;
    await user.save();

    // redirect to iniciar-sesion
    req.flash('correcto', 'La Cuenta ha sido activada satisfactoriamente');
    res.redirect('/iniciar-sesion');
}