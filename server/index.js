if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

const db = require('./models')

// Routers
const authRouter = require('./routes/auth')
app.use('/', authRouter)
const usersRouter = require('./routes/Users')
app.use('/users', usersRouter)
const shopsRouter = require('./routes/Shops')
app.use('/shops', shopsRouter)
const itemsRouter = require('./routes/Items')
app.use('/items', itemsRouter)
const categoriesRouter = require('./routes/Categories')
app.use('/categories', categoriesRouter)

db.sequelize.sync().then(() => {
    const port = process.env.DATABASE_PORT
    app.listen(port, () => {
        console.log('server running on port ' + port);
    })
})



