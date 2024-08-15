const express = require('express')
const router = express.Router()
const { Shop, User } = require('../models')
const { checkAuth, checkNotAuth, validateUserId } = require('../middleware')
const generateId = require('../utils/generateId')

router.get('/', async (req, res) => {
    try {
        const shops = await Shop.findAll()
        res.json(shops)
    } catch (err) {
        console.error('Error fetching shops:', err)
        res.status(500).send('Failed to fetch shops')
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const shop = await Shop.findByPk(id)
        if (shop) {
            res.json(shop)
        } else {
            res.status(404).send('Shop not found')
        }
    } catch (err) {
        console.error('Error fetching shop:', err)
        res.status(500).send('Failed to fetch shop')
    }
})

router.post('/', checkAuth, async (req, res) => {
    if (!(await validateUserId(req, req.body.UserId))) {
        return res.status(403).send('It is forbidden to create a shop for a different user')
    }
    var shop = req.body
    shop.id = generateId()
    try {
        const newShop = await Shop.create(shop)
        res.status(201).json(newShop)
    } catch (err) {
        console.error('Error creating shop:', err)
        res.status(500).send('Failed to create shop')
    }
})

router.patch('/:id', checkAuth, async (req, res) => {
    if (!(await validateShop(req))) {
        return res.status(403).send('It is forbidden to edit a shop for a different user')
    }
    const id = req.params.id
    var shop = req.body
    delete shop.UserId
    try {
        const [updated] = await Shop.update(shop, { where: { id } })
        if (updated) {
            const updatedShop = await Shop.findOne({ where: { id } })
            res.json(updatedShop)
        } else {
            res.status(404).send('Shop not found')
        }
    } catch (err) {
        console.error('Error updating shop:', err)
        res.status(500).send('Failed to update shop')
    }

})

router.delete('/:id', async (req, res) => {
    if (!(await validateShop(req))) {
        return res.status(403).send('It is forbidden to delete a shop for a different user')
    }
    const id = req.params.id
    try {
        const result = await Shop.destroy({ where: { id } })
        if (result === 0) {
            res.status(404).send('Shop not found')
        } else {
            res.json('Deleted')
        }
    } catch (err) {
        console.error('Error deleting shop:', err)
        res.status(500).send('Failed to delete shop')
    }
})

const validateShop = async (req) => {
    const id = req.params.id;
    try {
        const shop = await Shop.findByPk(id);
        if (!shop) {
            return false
        }
        return validateUserId(req, shop.UserId)
    } catch (err) {
        console.error('Error validating shop:', err);
        return false
    }
}

module.exports = router