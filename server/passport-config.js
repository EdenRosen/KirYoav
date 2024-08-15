const localStrategy = require('passport-local').Strategy

function initPassport(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }
        try {
            // if (await bcrypt.compare(password, user.password)) {
            if (password == user.password) {
                console.log(222);
                // return 'hi'
                return done(null, user)
            } else {
                console.log(password, user.password);
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            console.log(333);
            return done(e)
        }
    }

    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

module.exports = initPassport