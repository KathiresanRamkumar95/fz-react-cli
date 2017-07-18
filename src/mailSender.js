import nodemailer from 'nodemailer';

if (process.argv.length <= 6) {
  console.log('Usage: node mailSender <from> <pass> <to> <subject> <html>');
  process.exit(-1);
}

var from = process.argv[2];
var pass = process.argv[3];
var to = process.argv[4];
var subject = process.argv[5];
var html = process.argv[6];

var transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: from,
    pass: pass
  }
});

var mailOptions = {
  from: from,
  to: to,
  subject: subject,
  html: html
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});