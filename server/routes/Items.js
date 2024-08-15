const express = require('express')
const router = express.Router()
const { Item, Shop } = require('../models')
const { checkAuth, checkNotAuth, validateUserId } = require('../middleware')
const generateId = require('../utils/generateId')

router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll()
        res.json(items)
    } catch (err) {
        console.error('Error fetching items:', err)
        res.status(500).send('Failed to fetch items')
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const item = await Item.findByPk(id)
        if (item) {
            res.json(item)
        } else {
            res.status(404).send('Item not found')
        }
    } catch (err) {
        console.error('Error fetching item:', err)
        res.status(500).send('Failed to fetch item')
    }
})

router.post('/', checkAuth, async (req, res) => {
    const item = req.body
    try {
        const shop = await Shop.findByPk(item.ShopId)
        if (!shop) {
            res.status(404).send('Shop not found')
            return
        }

        if (!(await validateUserId(req, shop.UserId))) {
            res.status(403).send('It is forbidden to create an item for a different user')
            return
        }

        item.likes = '[]'
        item.id = generateId()

        const newItem = await Item.create(item)
        res.status(201).json(newItem)
    } catch (err) {
        console.error('Error creating item:', err)
        res.status(500).send('Failed to create item')
    }
})


router.patch('/:id', checkAuth, async (req, res) => {
    if (!(await validateItem(req))) {
        res.status(403).send('It is forbidden to edit an item for a different user')
        return
    }

    const id = req.params.id
    const newItem = req.body
    delete newItem.likes
    delete newItem.ShopId

    try {
        const [updated] = await Item.update(newItem, { where: { id } })
        if (updated) {
            const updatedItem = await Item.findOne({ where: { id } })
            res.json(updatedItem)
        } else {
            res.status(404).send('Item not found')
        }
    } catch (err) {
        console.error('Error updating item:', err)
        res.status(500).send('Failed to update item')
    }
})


router.patch('/:id/likes', checkAuth, async (req, res) => {
    const id = req.params.id;
    if (await validateItem(req)) {
        res.status(403).send('It is forbidden to like your own item')
        return
    }
    try {
        const oldItem = await Item.findByPk(id)
        if (!oldItem) {
            res.status(404).send('Item not found')
            return
        }

        const newItem = req.body
        if (!newItem.likes) {
            res.status(400).send('Invalid like request')
            return
        }

        // Only update likes and check validity
        const newLikes = JSON.parse(newItem.likes) || [];
        const oldLikes = JSON.parse(oldItem.likes) || [];
        const newC = newLikes.includes(req.user.id);
        const oldC = oldLikes.includes(req.user.id);
        const liked = newLikes.length === oldLikes.length + 1 && !oldC && newC;
        const disliked = newLikes.length === oldLikes.length - 1 && oldC && !newC;

        if (liked === disliked) {
            res.status(400).send('Invalid like request')
            return
        }

        const updatedItem = await Item.update(
            { likes: newItem.likes },
            { where: { id }, returning: true, plain: true }
        )

        res.json(updatedItem[1])
    } catch (err) {
        console.error('Error updating likes:', err)
        res.status(500).send('Failed to update likes')
    }
})

router.delete('/:id', checkAuth, async (req, res) => {
    if (!(await validateItem(req))) {
        res.status(403).send('It is forbidden to delete an item for a different user')
        return
    }
    const id = req.params.id
    try {
        const result = await Item.destroy({ where: { id } })
        if (result === 0) {
            res.status(404).send('Item not found')
        } else {
            res.json('Deleted')
        }
    } catch (err) {
        console.error('Error deleting item:', err)
        res.status(500).send('Failed to delete item')
    }
})

const validateItem = async (req) => {
    const id = req.params.id
    try {
        const item = await Item.findByPk(id)
        if (!item) {
            console.error('Item not found:', id)
            return false;
        }
        const shop = await Shop.findByPk(item.ShopId)
        if (!shop) {
            console.error('Shop not found for item:', item.ShopId)
            return false;
        }
        return validateUserId(req, shop.UserId)
    } catch (err) {
        console.error('Error validating item:', err)
        return false
    }
}


module.exports = router