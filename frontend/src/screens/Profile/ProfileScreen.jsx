import { useState, useEffect, useRef } from 'react'
import {
    Form,
    Button,
    Row,
    Col,
    Container,
    Table,
    Image,
} from 'react-bootstrap'
import { Scrollbar } from "react-scrollbars-custom";
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from './../../components/Message/Message'
import Loader from './../../components/Loader/Loader'
import { getUserDetails, updateUserProfile } from '../../actions/userActions'
import { listMyOrders } from './../../actions/orderAction'
import { listMyConsumerProducts, deleteConsumerProduct } from './../../actions/consumerProductAction'
import Meta from '../../components/Helmet/Meta';

const ProfileScreen = ({ history }) => {

    // const [show, setShow] = useState(false);
    // const [target, setTarget] = useState(null);
    // const ref = useRef(null);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cropSelection, setCropSelection] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, user, error } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    const consumerProductList = useSelector(state => state.consumerProductList)
    const { loading: loadingProducts, error: errorProducts, products } = consumerProductList

    const deleteHandler = (id, productName) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            dispatch(deleteConsumerProduct(id))
        }
    }

    console.log('=== PROFILE DEBUG ===')
    console.log('consumerProductList state:', consumerProductList)
    console.log('products:', products)
    console.log('loadingProducts:', loadingProducts)
    console.log('errorProducts:', errorProducts)

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
                dispatch(listMyConsumerProducts())
            } else {
                setName(user.name)
                setEmail(user.email)
                setCropSelection(user.cropSelection)
            }
        }
    }, [userInfo, history, user, dispatch, success])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password, cropSelection }))
        }
    }

    // const handleClick = (event) => {
    //     setShow(!show);
    //     setTarget(event.target);
    // };

    return (
        <Container fluid style={{ marginBottom: '50px' }}>
            <Meta
                title="Agroic | Profile"
            />
            <Row>
                <Col md={3}>
                    <h2 style={{ marginTop: '110px' }}>User Profile</h2>
                    {message && <Message variant='danger'>{message}</Message>}
                    {error && <Message variant='danger'>{error}</Message>}
                    {success && <Message variant='success'>Profile Updated!</Message>}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter name"
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email Address / NIC <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                                type="nic"
                                placeholder="Enter email or NIC"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='cropSelection'>
                            <Form.Label>Crop Selection (optional)</Form.Label>
                            <Form.Control
                                type="cropSelection"
                                placeholder="Enter cropSelection"
                                value={cropSelection}
                                onChange={(e) => setCropSelection(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='confirmPassword'>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary">Update</Button>
                    </Form>
                </Col>
                <Col md={9}>
                    <Scrollbar style={{ width: '100%', height: 630 }}>
                        <Container fluid>
                            <Row>
                                <h2 style={{ marginTop: '110px' }}>My Orders</h2>
                                {loadingOrders ? <Loader />
                                    : errorOrders ? <Message variant="danger">{errorOrders}</Message>
                                        : (
                                            <Table striped bordered hover responsive className="table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>DATE</th>
                                                        <th>TOTAL</th>
                                                        <th>PAID</th>
                                                        <th>DELIVERED</th>
                                                        <th>MORE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(order => (
                                                        <tr key={order._id}>
                                                            <td>{order._id}</td>
                                                            <td>{order.createdAt.substring(0, 10)}</td>
                                                            <td>{order.totalPrice}</td>
                                                            <td>{order.isPaid ? order.paidAt.substring(0, 10) :
                                                                <i className="fas fa-times" styles={{ color: "red" }}></i>
                                                            }</td>
                                                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) :
                                                                <i className="fas fa-times" styles={{ color: 'red' }}></i>
                                                            }</td>
                                                            <td>
                                                                <LinkContainer to={`/order/${order._id}`}>
                                                                    <Button className="btn-sm" variant="success">Details</Button>
                                                                </LinkContainer>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )
                                }
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <h2 style={{ marginTop: '30px' }}>My Products</h2>
                                </Col>
                                {loadingProducts ? <Loader />
                                    : errorProducts ? <Message variant="danger">{errorProducts}</Message>
                                        : products && products.length > 0 ? (
                                            <Table striped bordered hover responsive className="table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>PRODUCT NAME</th>
                                                        <th>SELLER NAME</th>
                                                        <th>IMAGE</th>
                                                        <th>PRICE</th>
                                                        <th>SIZE</th>
                                                        <th>QUANTITY</th>
                                                        <th>LOCATION</th>
                                                        <th>DELETE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {products.map(product => (
                                                        <tr key={product._id}>
                                                            <td>{product.prod_name}</td>
                                                            <td>{product.seller_name}</td>
                                                            <td>
                                                                <Image width={70} rounded src={product.image} />
                                                            </td>
                                                            <td>₹{product.price}</td>
                                                            <td>{product.prod_size}</td>
                                                            <td>{product.quantity}</td>
                                                            <td>{product.avalaible_location}</td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    className="btn btn-sm"
                                                                    onClick={() => deleteHandler(product._id, product.prod_name)}
                                                                >
                                                                    <i className="fas fa-trash"></i>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <Col xs={12} style={{ marginTop: '20px' }}>
                                                <Message variant="info">No products found. Start selling your farm produce today!</Message>
                                            </Col>
                                        )
                                }
                            </Row>
                        </Container>
                    </Scrollbar>
                </Col>
            </Row>
        </Container>
    )
}

export default ProfileScreen