const nodemailer = require('nodemailer')

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  // send mail with defined transport object
  return await transporter.sendMail({
    from: `"BreakFast Menu" <${process.env.EMAIL_USERNAME}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  })
}

module.exports = sendMail
