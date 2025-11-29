import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Form,
    Button,
    Row,
    Col,
    Container
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Message from './../../components/Message/Message'
import Loader from './../../components/Loader/Loader'
import { createConsumer } from '../../actions/consumerProductAction'

const AddFarmerProduct = () => {
    // Form fields based on consumer_products model
    const [prodName, setProdName] = useState('')
    const [sellerName, setSellerName] = useState('')
    const [image, setImage] = useState('')
    const [price, setPrice] = useState('')
    const [prodSize, setProdSize] = useState('')
    const [quantity, setQuantity] = useState('')
    const [availableLocation, setAvailableLocation] = useState('')
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()
    let history = useHistory()

    const consumerCreate = useSelector(state => state.consumerCreate)
    const { loading, success, error } = consumerCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
    }, [userInfo, history])

    const resetForm = () => {
        setProdName('')
        setSellerName('')
        setImage('')
        setPrice('')
        setProdSize('')
        setQuantity('')
        setAvailableLocation('')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        
        console.log('Form data being submitted:', {
            prod_name: prodName,
            seller_name: sellerName,
            image,
            price: Number(price),
            prod_size: prodSize,
            quantity: Number(quantity),
            avalaible_location: availableLocation,
        })
        
        const farmerProductData = {
            prod_name: prodName,
            seller_name: sellerName,
            image,
            price: Number(price),
            prod_size: prodSize,
            quantity: Number(quantity),
            avalaible_location: availableLocation,
        }
        
        dispatch(createConsumer(farmerProductData))
    }
    
    useEffect(() => {
        if (success) {
            resetForm()
        }
    }, [success])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/upload', formData, config)

            setImage(data)
            setUploading(false)

        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    return (
        <Container>
            <h2 className="text-center mb-4">FARMER</h2>
            <p className="text-center mb-4">
                Sell your fresh farm produce directly to buyers across the country. 
                Connect with thousands of companies looking for quality agricultural products at fair prices.
            </p>

            {success && <Message variant='success'>Your product has been submitted successfully!</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <Form onSubmit={submitHandler}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId='prod-name'>
                            <Form.Label>Product Name <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name (e.g., Organic Wheat, Fresh Tomatoes)"
                                value={prodName}
                                required
                                onChange={(e) => setProdName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId='seller-name'>
                            <Form.Label>Your Name <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={sellerName}
                                required
                                onChange={(e) => setSellerName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId='price'>
                            <Form.Label>Price (per unit) <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price per unit"
                                value={price}
                                required
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId='prod-size'>
                            <Form.Label>Product Size/Unit <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter size/unit (e.g., 1kg, 50kg bag, per quintal)"
                                value={prodSize}
                                required
                                onChange={(e) => setProdSize(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                        <Form.Group controlId='quantity'>
                            <Form.Label>Available Quantity <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter available quantity"
                                value={quantity}
                                required
                                onChange={(e) => setQuantity(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId='available-location'>
                            <Form.Label>Available Location <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location (e.g., Pune, Maharashtra)"
                                value={availableLocation}
                                required
                                onChange={(e) => setAvailableLocation(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        
                        <Form.Group controlId='product-image'>
                            <Form.Label>Product Image <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image url"
                                value={image}
                                required
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.File
                                id='product-image-file'
                                label='Choose File'
                                custom
                                onChange={uploadFileHandler}
                            ></Form.File>
                            {uploading && <Loader />}
                        </Form.Group>
                        
                        <br />
                        <Button type="submit" variant="success" size="lg" block>
                            Submit Product for Sale
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}

export default AddFarmerProduct;