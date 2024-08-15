const auth = require('./config/firebase-config')
const { User } = require('./models')

const decodeToken = async (req) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return null
    }
    try {
        const decodedToken = await auth.verifyIdToken(token)
        return decodedToken
    } catch (error) {
        return null
    }
}

const checkAuth = async (req, res, next) => {
    const decodedToken = await decodeToken(req)
    if (decodedToken) {
        // Authorization succeeded
        req.user = decodedToken
        try {
            const user = await User.findOne({ where: { email: req.user.email } })
            if (user) {
                req.user.id = user.id
                return next()
            } else {
                console.error('Not supposed to reach here! User authorized but not found')
                return res.status(404).send('User not found')
            }
        } catch (error) {
            console.error('Error finding user:', error)
            return res.status(500).send('Internal server error')
        }
    } else {
        return res.status(401).send('Authentication required')
    }
}

const checkNotAuth = async (req, res, next) => {
    const decodedToken = await decodeToken(req)
    if (!decodedToken) {
        return next()
    } else {
        res.status(403).send('Authorized users are not allowed')
    }
}

const adminAuth = (req, res, next) => {
    const adminKey = req.headers['admin-key']
    if (adminKey == process.env.ADMIN_SECRET_KEY) {
        return next()
    } else {
        res.status(403).send('Admin only allowed')
    }
}

const validateUserId = (req, id) => {
    if (req.user.email == process.env.ADMIN_GMAIL_ADDRESS) return true
    return req.user.id == id
}

module.exports = { checkAuth, checkNotAuth, validateUserId, adminAuth }