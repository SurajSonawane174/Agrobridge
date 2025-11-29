import express from 'express'
import asyncHandler from 'express-async-handler'

import ProductSeeds from './../models/productSeedModel.js';

const getSeedProducts = asyncHandler(async (req, res) => {
    const productSeed = await ProductSeeds.find({})
    res.json(productSeed);
})

const getSeedProductById = asyncHandler(async (req, res) => {
    const productSeed = await ProductSeeds.findById(req.params.id);

    if (productSeed) {
        res.json(productSeed);
    } else {
        res.status(404)
        throw new Error('Seed not Found')
    }
})

const deleteSeedProduct = asyncHandler(async (req, res) => {
    const productSeed = await ProductSeeds.findById(req.params.id);

    if (productSeed) {
        productSeed.remove()
        res.json({ message: "Product removed" });
    } else {
        res.status(404)
        throw new Error('Seed not Found')
    }
})

const createSeedProduct = asyncHandler(async (req, res) => {

    try {
        const { name, image, description, category, countInStock, price } = req.body

        // Validate input
        if (!name || !description || !category || price == null || countInStock == null) {
            res.status(400)
            throw new Error('Please provide all required seed details')
        }

        const seed = new ProductSeeds({
            user: req.user._id,
            name,
            image,
            description,
            category,
            countInStock: Number(countInStock) || 0,
            price: Number(price) || 0,
            rating: 0,
            numReviews: 0
        })

        const createdSeed = await seed.save()
        res.status(201).json(createdSeed)

    }
    catch (error) {
        console.error('ERROR:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        res.status(500).json({
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });
    }
})

const updateSeedProduct = asyncHandler(async (req, res) => {
    const { name, price, image, description, category, countInStock } = req.body

    const updateProductSeed = await ProductSeeds.findById(req.params.id)

    if (updateProductSeed) {

        updateProductSeed.name = name
        updateProductSeed.price = price
        updateProductSeed.image = image
        updateProductSeed.description = description
        updateProductSeed.category = category
        updateProductSeed.countInStock = countInStock

        const updatedProduct = await updateProductSeed.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(401)
        throw new Error('Product not found')
    }
})

const createSeedProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const productSeed = await ProductSeeds.findById(req.params.id)

    if (productSeed) {
        const alreadyReviewed = productSeed.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        productSeed.reviews.push(review)

        productSeed.numReviews = productSeed.reviews.length

        productSeed.rating = productSeed.reviews.reduce((acc, item) => item.rating + acc, 0) / productSeed.reviews.length

        await productSeed.save()

        res.status(201).json({ message: 'Review added' })

    } else {
        res.status(401)
        throw new Error('Product not found')
    }
})

export {
    getSeedProducts,
    getSeedProductById,
    deleteSeedProduct,
    createSeedProduct,
    updateSeedProduct,
    createSeedProductReview
}