const sendMail = require('./sendMail')
const sendVerificationEmail = async ({
  userEmail,
  subject,
  origin,
  verificationToken,
  userName,
}) => {
  let verificationLink = `${origin}?user=${userEmail}&token=${verificationToken}`
  let message = `<h4>Hello ${userName},</h4><p>Please click on the following link to verify your account: <a href="${verificationLink}">Verify account</a></p>`
  return await sendMail({ to: userEmail, subject: subject, html: message })
}

module.exports = sendVerificationEmail
