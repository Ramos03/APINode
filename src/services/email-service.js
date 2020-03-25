'use strict';

let config = require('../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.send = async (to, subject, body) =>{
    sgMail.send({
        to: to,
        from: 'sordiramos@gmail.com',
        subject: subject,
        html: body
    });
}
