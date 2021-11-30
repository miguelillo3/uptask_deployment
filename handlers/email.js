const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const { convert } = require('html-to-text');
const util = require('util');
const emailCongif = require('../config/email');

// Create HTML function
const createHTML = (file, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${file}.pug`, options);
    return juice(html);
}

let transport = nodemailer.createTransport({
    host: emailCongif.host,
    port: emailCongif.port,
    auth: {
        user: emailCongif.auth.user,
        pass: emailCongif.auth.pass
    }   
});

exports.send = async (options) => {
    const html = createHTML(options.file, options); // html body
    const text = convert(html); // plain text body
    // send mail with defined transport object
    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com>', // sender address
        to: options.user.email, // list of receivers
        subject: options.subject, // Subject line
        text, 
        html 
    };
    
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, mailOptions)
}
