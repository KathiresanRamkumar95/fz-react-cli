import nodemailer from 'nodemailer';

if (process.argv.length <= 6) {
  console.log('Usage: node mailSender <from> <pass> <to> <subject> <html>');
  process.exit(-1);
}

let from = process.argv[2];
let pass = process.argv[3];
let to = process.argv[4];
let subject = process.argv[5];
let html = process.argv[6];
let cc = process.argv[7];

let transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: from,
    pass
  }
});

let mailOptions = {
  from,
  to,
  cc,
  subject,
  html
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Email sent: ${info.response}`);
  }
});
