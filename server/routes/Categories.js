const express = require('express')
const router = express.Router()
const { Category } = require('../models')
const { adminAuth } = require('../middleware')
const generateId = require('../utils/generateId')

router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll()
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err)
        res.status(500).send('Failed to fetch categories')
    }
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const category = await Category.findByPk(id)
        if (category) {
            res.json(category)
        } else {
            res.status(404).send('Category not found')
        }
    } catch (err) {
        console.error('Error fetching category:', err)
        res.status(500).send('Failed to fetch category')
    }
})

router.post('/', adminAuth, async (req, res) => {
    const category = req.body
    category.id = generateId()
    try {
        const newCategory = await Category.create(category)
        res.status(201).json(newCategory)
    } catch (err) {
        console.error('Error creating category:', err)
        res.status(500).send('Failed to create category')
    }
})

router.patch('/:id', adminAuth, async (req, res) => {
    const id = req.params.id
    const newCategory = req.body
    try {
        const [updated] = await Category.update(newCategory, { where: { id } })
        if (updated) {
            const updatedCategory = await Category.findOne({ where: { id } })
            res.json(updatedCategory)
        } else {
            res.status(404).send('Category not found')
        }
    } catch (err) {
        console.error('Error updating category:', err)
        res.status(500).send('Failed to update category')
    }
})

router.delete('/:id', adminAuth, async (req, res) => {
    const id = req.params.id
    try {
        const result = await Category.destroy({ where: { id } })
        if (result) {
            res.json('Deleted')
        } else {
            res.status(404).send('Category not found')
        }
    } catch (err) {
        console.error('Error deleting category:', err)
        res.status(500).send('Failed to delete category')
    }
})

module.exports = router
