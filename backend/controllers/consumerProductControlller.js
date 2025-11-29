import express from 'express'
import asyncHandler from 'express-async-handler'

import ConsumerProducts from './../models/consumerProductModel.js';

// @desc    Fetch all products
// @rout    GET /consumer
// @access  public
const getConsumerProducts = asyncHandler(async (req, res) => {
    const consumerProducts = await ConsumerProducts.find({})
    res.json(consumerProducts);
})

// @desc    Get logged in user's consumer products
// @route   GET /api/consumer/myproducts
// @access  private
const getMyConsumerProducts = asyncHandler(async (req, res) => {
    const consumerProducts = await ConsumerProducts.find({ user: req.user._id })
    res.json(consumerProducts);
})

// @desc    Fetch Consumer Product by id
// @rout    GET /consumer/:id
// @access  public
const getConsumerProductById = asyncHandler(async (req, res) => {
    const consumerProduct = await ConsumerProducts.findById(req.params.id);

    if(consumerProduct) {
        res.json(consumerProduct);
    } else {
        res.status(404)
        throw new Error('Consumer Product not Found')
    }
})

// @desc    Delete consumer product
// @rout    DELETE /consumer/:id
// @access  private/admin
const deleteConsumerProduct = asyncHandler(async (req, res) => {
    const consumerProduct = await ConsumerProducts.findById(req.params.id);

    if(consumerProduct) {
        // Check if user owns this product
        if(consumerProduct.user.toString() !== req.user._id.toString()) {
            res.status(401)
            throw new Error('Not authorized to delete this product')
        }
        
        await consumerProduct.remove()  // ADD await here!
        res.json({ message: 'Consumer product removed' });
    } else {
        res.status(404)
        throw new Error('Consumer Product not Found')
    }
})

// @desc    Create Consumer
// @rout    POST /consumer/
// @access  private/ Admin
const createConsumer = asyncHandler(async (req, res) => {

    console.log('=== CREATE CONSUMER DEBUG ===')
    console.log('Full req.body:', req.body)
    console.log('Content-Type:', req.headers['content-type'])
    
    const { prod_name, seller_name, image, price, prod_size, quantity, avalaible_location } = req.body

    console.log('Extracted fields:', {
        prod_name,
        seller_name,
        image,
        price,
        prod_size,
        quantity,
        avalaible_location
    })

    const consumerProduct = new ConsumerProducts({
        user: req.user._id,
        prod_name: prod_name || 'Sample Product',
        seller_name: seller_name || req.user.name,
        image: image || '/images/sample.jpg',
        price: price ? Number(price) : 0,
        prod_size: prod_size || '1kg',
        quantity: quantity ? Number(quantity) : 0,
        avalaible_location: avalaible_location || 'Not specified'
    })

    const createdConsumerProduct = await consumerProduct.save()
    res.status(201).json(createdConsumerProduct)
})

// @desc    Update Consumer
// @rout    PUT /consumer/:id
// @access  private/ Admin
const updateConsumer = asyncHandler(async (req, res) => {
    const { prod_name, price, image, seller_name, prod_size, quantity, avalaible_location } = req.body

    const updateConsumerproduct = await ConsumerProducts.findById(req.params.id)

    if (updateConsumerproduct) {

        updateConsumerproduct.prod_name = prod_name
        updateConsumerproduct.price = price
        updateConsumerproduct.image = image
        updateConsumerproduct.seller_name = seller_name
        updateConsumerproduct.quantity = quantity
        updateConsumerproduct.prod_size = prod_size
        updateConsumerproduct.avalaible_location = avalaible_location

        const updatedConsumer = await updateConsumerproduct.save()
        res.status(201).json(updatedConsumer)
    } else {
        res.status(401)
        throw new Error('Product not found')
    }
})

// @desc    Create product review
// @route   POST /api/products/consumer/:id/reviews
// @access  private
const createConsumerProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const consumerProduct = await ConsumerProducts.findById(req.params.id)

    if (consumerProduct) {
        const alreadyReviewed = consumerProduct.reviews.find(
            (review) => review.user && review.user.toString() === req.user._id.toString()
        )

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed by you')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        consumerProduct.reviews.push(review)

        await consumerProduct.save()
        res.status(201).json({ message: 'Review added successfully' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export {
    getConsumerProducts,
    getMyConsumerProducts,
    getConsumerProductById,
    deleteConsumerProduct,
    createConsumer,
    updateConsumer,
    createConsumerProductReview
}