import React from 'react';
import ProductList from './ProductList';
import {ProductProvider} from '../contexts/ProductContext';


function Index() {
    const seller = JSON.parse(localStorage.getItem('seller'));
    return (
        <div>
            <h1>Site marchand</h1>
            { seller == null && 
                <ProductProvider>
                    <ProductList>
                        
                    </ProductList>
                </ProductProvider> }
        </div>
    )
}

export default Index;