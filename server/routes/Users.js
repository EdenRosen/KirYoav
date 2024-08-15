const express = require('express')
const router = express.Router()
const { User } = require('../models')
const { checkAuth, checkNotAuth, validateUserId } = require('../middleware')

router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const user = await User.findByPk(id)
    res.json(user)
})

router.patch('/:id', checkAuth, async (req, res) => {
    const id = req.params.id
    if (!validateUserId(req, id)) {
        res.status(403).send('It is forbidden to edit a different user')
        return
    }
    var newUser = req.body
    delete newUser.email
    
    const user = await User.update(
        newUser,
        { where: { id } }
    )
    res.json(user)
})

router.delete('/:id', checkAuth, async (req, res) => {
    const id = req.params.id
    if (!validateUserId(req, id)) {
        res.json('Delete failed')
        return
    }
    await User.destroy({ where: { id } })
    res.json('Deleted')
})


// temporary so i can delete:
// router.delete('/:id', async (req, res) => {
//     const id = req.params.id
//     await User.destroy({ where: { id } })
//     res.json('Deleted')
// })


module.exports = router