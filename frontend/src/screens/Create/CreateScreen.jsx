import React from 'react'
import {
    Container,
} from 'react-bootstrap';
import Meta from '../../components/Helmet/Meta';
import AddFarmerProduct from '../../components/FarmerProduct/AddFarmerProduct';
import './createStyles.css'

const CreateScreen = () => {
    return (
        <Container className='supplierContainer'>
            <Meta
                title="Agroic | Supplier"
            />
            <h1 className='title'>Farmer</h1>
            <h4 className="supplier-title">
                Sell your fresh farm produce directly to buyers across the country. Connect with thousands of companies looking for quality agricultural products at fair prices.</h4>
            <br />
            <AddFarmerProduct />
        </Container>
    )
}

export default CreateScreen