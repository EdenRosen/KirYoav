const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD
    }
}) 


function sendMail(email, subject, html, link) {
    const filePath = path.join(__dirname, `../html/${html}.html`)
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        const htmlContent = data.replace('verification-link', link)

        const mailOptions = {
            from: process.env.GMAIL_ADDRESS,
            to: email,
            subject: subject,
            html: htmlContent
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('send email error: ', error)
                return false
            }
        })

        return true
    } catch (err) {
        console.error('Error reading file:', err)
        return false
    }
    
}


module.exports = sendMail

