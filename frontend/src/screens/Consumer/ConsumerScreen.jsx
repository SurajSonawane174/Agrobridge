import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Container,
    Row,
    Button,
    Alert
} from 'react-bootstrap';
import ConsumerProducts from './../../components/ConsumerProducts/ConsumerProducts'
import { listConsumerProducts } from './../../actions/consumerProductAction.js'
import Message from './../../components/Message/Message';
import Loader from './../../components/Loader/Loader';
import './ConsumerStyles.css'
import Meta from '../../components/Helmet/Meta';

const ConsumerScreen = () => {

    const dispatch = useDispatch();

    const consumerProductList = useSelector(state => state.consumerProductList)
    const { loading, products, error } = consumerProductList

    const [numberOfItems, setNumberOfItems] = useState(3);

    useEffect(() => {
        dispatch(listConsumerProducts())
    }, [dispatch])

    const showMore = () => {
        // Add safety check here too
        if (products && numberOfItems + 3 <= products.length) {
            setNumberOfItems(numberOfItems + 3)
        } else if (products) {
            setNumberOfItems(products.length)
        }
    }

    return (
        <div className="consumerProductScreen">
            <Meta
                title="Agroic | Consumer"
            />
            <Container className='consumerContainer'>
                <h1 className="title">CONSUMER</h1>
                <h4 className="consumer-title">
                    No need to visit field to get grains!!! Just order here and and get all kinds of garins deliverd at your doorstep. Why to wait? Go and order.</h4>
                <br />
                {
                    loading ? <Loader />
                        : error ? <Message variant='danger'>{error}</Message>
                            : products && products.length > 0 ? (
                                <Row>
                                    {
                                        products
                                            .slice(0, numberOfItems)
                                            .map(consumer => (
                                                <ConsumerProducts
                                                    key={consumer._id}
                                                    _id={consumer._id}
                                                    prod_name={consumer.prod_name}
                                                    seller_name={consumer.seller_name}
                                                    image={consumer.image}
                                                    price={consumer.price}
                                                    prod_size={consumer.prod_size}
                                                    avalaible_location={consumer.avalaible_location}
                                                    quantity={consumer.quantity}
                                                />
                                            ))
                                    }
                                    {
                                        numberOfItems >= products.length
                                            ? <Alert style={{ backgroundColor: 'red' }} className="col-md-12 text-center">Finished</Alert>
                                            : ''
                                    }
                                    <Button className="col-md-12 text-center" variant="success outline-dark" onClick={showMore}>Show more</Button>
                                </Row>
                            ) : (
                                <Message variant='info'>No products available at the moment.</Message>
                            )
                }
            </Container>
        </div>
    )
}

export default ConsumerScreen