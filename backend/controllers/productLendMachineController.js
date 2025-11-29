import express from 'express'
import asyncHandler from 'express-async-handler'

import ProductLendMachines from './../models/productLendMachineModel.js';

const getLendMachnines = asyncHandler(async(req, res) => {
    const productLendMachine = await ProductLendMachines.find({})
    res.json(productLendMachine);
})


const getLendMachnineById = asyncHandler(async(req, res) => {
    const productLendMachine = await ProductLendMachines.findById(req.params.id);

    if(productLendMachine) {
        res.json(productLendMachine);
    } else {
        res.status(404)
        throw new Error('Machine not Found')
    }
})

const deleteLendMachnine = asyncHandler(async(req, res) => {
    const lendMachine = await ProductLendMachines.findById(req.params.id);

    if(lendMachine) {
        lendMachine.remove()
        res.json({ message: 'Machine Removed' });
    } else {
        res.status(404)
        throw new Error('Machine not Found')
    }
})

const createLendMachine = asyncHandler(async (req, res) => {
    const { name, image, description, target_plant, price, quantity, machine_power } = req.body

    if (!name || !description || !target_plant || !price || !quantity || !machine_power) {
        res.status(400)
        throw new Error('Please provide all required machine details')
    }

    const lendMachine = new ProductLendMachines({
        user: req.user._id,
        name,
        image,
        description,
        target_plant,
        price,
        quantity,
        machine_power,
    })

    const createdLendMachine = await lendMachine.save()
    res.status(201).json(createdLendMachine)
})

const updateLendMachine = asyncHandler(async (req, res) => {
    const { name, price, image, description, target_plant, quantity, machine_power } = req.body

    const updateLendMachine = await ProductLendMachines.findById(req.params.id)

    if (updateLendMachine) {

        updateLendMachine.name = name
        updateLendMachine.price = price
        updateLendMachine.image = image
        updateLendMachine.description = description
        updateLendMachine.target_plant = target_plant
        updateLendMachine.quantity = quantity
        updateLendMachine.machine_power = machine_power

        const updatedMachine = await updateLendMachine.save()
        res.status(201).json(updatedMachine)
    } else {
        res.status(401)
        throw new Error('Product not found')
    }
})

export { 
    getLendMachnines, 
    getLendMachnineById, 
    deleteLendMachnine,
    createLendMachine,
    updateLendMachine
}