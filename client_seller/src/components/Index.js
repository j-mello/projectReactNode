import React, {useContext} from 'react';
import ProductList from './ProductList';
import {ProductProvider} from '../contexts/ProductContext';
import {SessionContext} from '../contexts/SessionContext';


function Index() {
    const {seller} = useContext(SessionContext);
    return (
        <div style={{textAlign: "center"}}>
            <h1>Site marchand</h1>
            <ProductProvider seller={seller}>
                {
                    seller == null &&
                    <ProductList/>
                }
            </ProductProvider>
        </div>
    )
}

export default Index;