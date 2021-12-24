// Import the Users model
const Users = require('../models/Users');
const crypto = require('crypto');
const sendEmail = require('../handlers/email');

exports.formNewAccount = (req, res) => {
    res.render('newAccount', {
        pageName: 'Crear Cuenta en UpTask'
    }
    );
}

exports.formSessionInit = (req, res) => {
    res.render('sessionInit', {
        pageName: 'Iniciar Sesión en UpTask'
    }
    );
}

exports.createNewAccount = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Create the user
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = Date.now() + 3600000;
        const user = await Users.create({
            email,
            password,
            token,
            expiration
        });
        //
        // Generate the confirm url 
        const confirmUrl = `http://${req.headers.host}/activar-cuenta/${user.token}`;

        // Send email to user with token to confirm the created account
        await sendEmail.send({
            user,
            subject: "Confirmar Nueva Cuenta UpTask",
            confirmUrl,
            file: 'newAccount'
        });
        //
        req.flash('correcto', 'Cuenta creada. Para completar el alta, debe confirmar su cuenta a través del correo que se le ha enviado.');
        // and redirect
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // console.log('Este es el error --> ', error, ' -- Response: ', response);
        if(Array.isArray(error.errors)) {
            req.flash('error', error.errors.map(error => error.message));
        } else {
            req.flash(error.message || error.response);
        }
        res.render('newAccount', {
            messages: req.flash(),
            email,
            password,
            pageName: 'Crear Cuenta en UpTask'
        });
    }
}

exports.resetPasswordForm = (req, res) => {
    res.render('resetPassReq', {
        messages: res.locals.messages,
        pageName: 'Restablecer Contraseña',
        email: req.query.email
    });
}

