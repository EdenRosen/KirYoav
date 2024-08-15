const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { checkAuth, checkNotAuth } = require('../middleware')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator')
const auth = require('../config/firebase-config')
const testPassword = require('../utils/passwordTest')
const generateId = require('../utils/generateId')
const sendMail = require('../utils/nodemailer')


router.get('/', async (req, res) => {
    res.json('Hello there! You reached the Garage Market backend server')
})

router.post('/login', checkNotAuth, async (req, res) => {
    const email = req.body.email
    try {
        const firebaseUser = await auth.getUserByEmail(email)
        res.json({ emailVerified: firebaseUser.emailVerified })
    } catch {
        console.error('Error fetching user by email:', err)
        res.status(404).send('User with this email does not exist')
    }
})

router.post('/register-google', checkAuth, async (req, res) => {
    const email = req.user.email
    try {
        // Check if user is already registered
        const userFound = await User.findOne({ where: { email } })
        if (userFound) {
            res.status(409).send('User with this email already exists')
            return
        }

        // Add user to database
        const name = email.slice(0, email.indexOf('@'))
        const user = {
            id: generateId(),
            name: name,
            email: email,
        }
        const newUser = await User.create(user)
        res.status(201).json(newUser)
    } catch (err) {
        console.error('Error registering user:', err)
        res.status(500).send('Failed to register user')
    }
})

router.post('/register', checkNotAuth, async (req, res) => {
    const password = req.body.password
    const user = {
        name: req.body.name,
        email: req.body.email,
    }

    try {
        const users = await User.findAll()

        // Check for same email
        const sameEmail = users.find(e => e.email === user.email)
        if (sameEmail) {
            res.status(409).send('User with this email already exists')
            return
        }

        // Check for same name
        const sameName = users.find(e => e.name === user.name)
        if (sameName) {
            res.status(409).send('Name is taken')
            return
        }

        // Validate email
        if (!emailValidator.validate(user.email)) {
            res.status(400).send('Email is invalid')
            return
        }

        // Validate password
        const test = testPassword(password)
        if (!test.valid) {
            res.status(400).send(test.message)
            return
        }

        // Add user to Firebase
        try {
            // Check if a user with a verified email exists with the email
            const firebaseUser = await auth.getUserByEmail(user.email)
            if (firebaseUser.emailVerified) {
                res.status(409).send('User with this email already exists')
                return
            }
            user.uid = firebaseUser.uid
        } catch {
            // If no user with the email is in firebase, add one to firebase
            const firebaseUser = await auth.createUser({
                email: user.email,
                password,
                displayName: user.name,
            })
            user.uid = firebaseUser.uid
        }

        // Send verification email
        const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: '10m' })
        const link = `${req.headers.host}/verify-email?token=${token}`
        const mailRes = await sendMail(
            user.email,
            'Garage Market - verify your email',
            'EmailSignUp',
            link,
        )

        if (mailRes) {
            res.json('Validation email Sent')
        } else {
            res.status(500).send('Validation email failed to send')
        }
    } catch (err) {
        console.error('Error registering user:', err)
        res.status(500).send('Failed to register user')
    }
})

router.get('/verify-email', checkNotAuth, async (req, res) => {
    const token = req.query.token
    if (!token) {
        res.status(400).send('Token is missing')
        return
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
        if (err) {
            res.status(400).send('Invalid or expired token')
            return
        }

        const user = {
            id: generateId(),
            name: decodedToken.user.name,
            email: decodedToken.user.email,
        }

        try {
            // Check if a user with the same email already exists
            const sameEmail = await User.findOne({ where: { email: user.email } })
            if (sameEmail) {
                res.status(409).send('User with this email already exists')
                return
            }

            // Confirm email for Firebase user
            await auth.updateUser(decodedToken.user.uid, { emailVerified: true })

            // Add user to database
            await User.create(user)

            res.redirect(`${process.env.CLIENT_URL}/login`)
        } catch (err) {
            console.error('Error verifying email:', err)
            res.status(500).send('Failed to verify email')
        }
    })
})

router.post('/forgot-password', checkNotAuth, async (req, res) => {
    const { email } = req.body

    try {
        // Query the database for the user with the given email
        const userFound = await User.findOne({ where: { email } })
        if (!userFound) {
            return res.status(404).send('No user with this email is registered')
        }

        // Generate token
        const tokenContent = { email }
        const token = jwt.sign(tokenContent, process.env.JWT_KEY, { expiresIn: '10m' })
        const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`

        // Send email
        const mailRes = await sendMail(
            email,
            'Garage Market - Forgot password',
            'EmailForgotPassword',
            link,
        )

        if (mailRes) {
            return res.json('Email Sent')
        } else {
            return res.status(500).send('Validation email failed to send')
        }
    } catch (error) {
        console.error(error)
        console.error('Forgot password request error:', error)
        return res.status(500).send('Forgot password request failed')
    }
})

router.patch('/reset-password', async (req, res) => {
    const token = req.query.token
    if (!token) {
        return res.status(400).send('Token required')
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
        if (err) {
            return res.status(400).send('Token expired. Resend email')
        }

        // Check if user exists
        const email = decodedToken.email
        let firebaseUser
        try {
            firebaseUser = await auth.getUserByEmail(email)
            if (!firebaseUser.emailVerified) throw new Error()
        } catch {
            return res.status(404).send('User with this email does not exist')
        }

        // Check for password validity
        const newPassword = req.body.password
        const test = testPassword(newPassword)
        if (!test.valid) {
            return res.status(400).send(test.message)
        }

        // Update password in firebase
        try {
            await auth.updateUser(firebaseUser.uid, { password: newPassword })
            res.json('Password was updated')
        } catch (err) {
            console.error('Error updating password:', err)
            res.status(500).send('Failed to update password')
        }
    })
})


module.exports = router