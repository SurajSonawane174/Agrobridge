import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Form,
    Button,
    Row,
    Col,
    Container,
    Tabs,
    Tab
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Message from './../../components/Message/Message'
import Loader from './../../components/Loader/Loader'
import { createSeedProducts } from '../../actions/productSeedActions'
import { createLendMachine } from '../../actions/productLendMachinesActions'

const AddSupplierProduct = () => {
    const [activeTab, setActiveTab] = useState('seed')
    
    // Common fields
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [uploading, setUploading] = useState(false)
    
    // Seed specific fields
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState('')
    
    // Machine specific fields
    const [targetPlant, setTargetPlant] = useState('')
    const [machinePower, setMachinePower] = useState('')
    const [quantity, setQuantity] = useState('')

    const dispatch = useDispatch()
    let history = useHistory()

    const productCreate = useSelector(state => state.productCreate)
    const { loading, success, error } = productCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
    }, [userInfo, history, dispatch])

    const resetForm = () => {
        setName('')
        setImage('')
        setDescription('')
        setPrice('')
        setCategory('')
        setCountInStock('')
        setTargetPlant('')
        setMachinePower('')
        setQuantity('')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        
        if (activeTab === 'seed') {
            const seedData = {
                name,
                image,
                description,
                category,
                countInStock: Number(countInStock),
                price: Number(price),
                rating: 0,
            }
            dispatch(createSeedProducts(seedData))
        } else if (activeTab === 'machine') {
            const machineData = {
                name,
                image,
                description,
                target_plant: targetPlant,
                machine_power: machinePower,
                price: Number(price),
                quantity: Number(quantity),
            }
            dispatch(createLendMachine(machineData))
        }

        resetForm()
    }

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

    const handleTabChange = (key) => {
        setActiveTab(key)
        resetForm()
    }

    return (
        <Container>
            <h2 className="text-center mb-4">SUPPLIER</h2>
            <p className="text-center mb-4">
                Sell your wide variety of products related to farming, through our platform. 
                We have millions of farmers connected from all parts of country.
            </p>

            {success && <Message variant='success'>Your product has been submitted</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => handleTabChange(k)}
                className="mb-4"
                id="product-type-tabs"
            >
                <Tab eventKey="seed" title="Seed">
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId='seed-name'>
                                    <Form.Label>Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter seed name"
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='seed-category'>
                                    <Form.Label>Category <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter category (e.g., Vegetable, Grain, Fruit)"
                                        value={category}
                                        required
                                        onChange={(e) => setCategory(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='seed-price'>
                                    <Form.Label>Price <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter price"
                                        value={price}
                                        required
                                        onChange={(e) => setPrice(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='seed-stock'>
                                    <Form.Label>Count In Stock <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter quantity in stock"
                                        value={countInStock}
                                        required
                                        onChange={(e) => setCountInStock(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId='seed-image'>
                                    <Form.Label>Image <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter image url"
                                        value={image}
                                        required
                                        onChange={(e) => setImage(e.target.value)}
                                    ></Form.Control>
                                    <Form.File
                                        id='seed-image-file'
                                        label='Choose File'
                                        custom
                                        onChange={uploadFileHandler}
                                    ></Form.File>
                                    {uploading && <Loader />}
                                </Form.Group>
                                
                                <Form.Group controlId='seed-description'>
                                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        as="textarea" 
                                        rows={5}
                                        placeholder="Enter seed description"
                                        value={description}
                                        required
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <br />
                                <Button type="submit" variant="primary">Submit Seed Product</Button>
                            </Col>
                        </Row>
                    </Form>
                </Tab>

                <Tab eventKey="machine" title="Machine">
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId='machine-name'>
                                    <Form.Label>Machine Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter machine name"
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='machine-target'>
                                    <Form.Label>Target Plant <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter target plant/crop"
                                        value={targetPlant}
                                        required
                                        onChange={(e) => setTargetPlant(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='machine-power'>
                                    <Form.Label>Machine Power <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter machine power (e.g., 5HP, 1000W)"
                                        value={machinePower}
                                        required
                                        onChange={(e) => setMachinePower(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='machine-price'>
                                    <Form.Label>Price <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter price"
                                        value={price}
                                        required
                                        onChange={(e) => setPrice(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <Form.Group controlId='machine-quantity'>
                                    <Form.Label>Quantity <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter available quantity"
                                        value={quantity}
                                        required
                                        onChange={(e) => setQuantity(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId='machine-image'>
                                    <Form.Label>Image <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter image url"
                                        value={image}
                                        required
                                        onChange={(e) => setImage(e.target.value)}
                                    ></Form.Control>
                                    <Form.File
                                        id='machine-image-file'
                                        label='Choose File'
                                        custom
                                        onChange={uploadFileHandler}
                                    ></Form.File>
                                    {uploading && <Loader />}
                                </Form.Group>
                                
                                <Form.Group controlId='machine-description'>
                                    <Form.Label>Description <span style={{ color: 'red' }}>*</span></Form.Label>
                                    <Form.Control
                                        as="textarea" 
                                        rows={5}
                                        placeholder="Enter machine description"
                                        value={description}
                                        required
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></Form.Control>
                                </Form.Group>
                                
                                <br />
                                <Button type="submit" variant="primary">Submit Machine Product</Button>
                            </Col>
                        </Row>
                    </Form>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default AddSupplierProduct