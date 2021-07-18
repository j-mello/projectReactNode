import React, {useContext, useEffect} from 'react';
import {ProductContext} from '../contexts/ProductContext';

function ProductList(){

    const {
        list, buyProduct, cart, priceByCurrency
    } = useContext(ProductContext);

    return (
        <div>
            <h1>Voici la liste des produits</h1>
            <ul>
                {list.map((item) => 
                    <li key={item.id}>
                        <span>{item.productName} </span>
                        <span>{item.price} </span>
                        <span>{item.currency} </span>
                        <input type='button' value="Acheter" onClick={()=> 
                            window.confirm("C'est votre dernier mot ?") &&
                            buyProduct(item)}>
                        </input>
                        {item.nbPurchase > 0 &&
                        <span> Acheté : {item.nbPurchase} fois </span>}
                    </li>
                )}
            </ul>
            <div>Nombre élements du panier : {cart.length}</div>
            <div>Prix total : 
                <ul>{
                Object.keys(priceByCurrency).map((currency) => 
                <li key={currency}>{currency} : {priceByCurrency[currency]}</li>
                )
            }</ul>
             </div>
        </div>
    );
}

export default ProductList;