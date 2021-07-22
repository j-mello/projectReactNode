import React, {useContext, useEffect} from 'react';
import {ProductContext} from '../contexts/ProductContext';

function ProductList(){

    const {
        list, buyProduct, carts, priceByCurrency, removeProduct
    } = useContext(ProductContext);

    useEffect(() => console.log(carts), [carts]);

    return (
        <div>
            <h1>Voici la liste des produits</h1>
            <ul>
                {list.map((item) => 
                    <li key={item.id}>
                        <span>{item.productName} </span>
                        <span>{item.price} </span>
                        <span>{item.currency} </span>
                        <span>Societé : {item.SellerSociety} </span>
                        <input type='button' value="Acheter" onClick={()=> 
                            window.confirm("C'est votre dernier mot ?") &&
                            buyProduct(item)}>
                        </input>
                        {item.nbPurchase > 0 &&
                        <span> Acheté : {item.nbPurchase} fois </span>}
                    </li>
                )}
            </ul>
            <div>Nombre élements du panier : {Object.keys(carts).reduce((acc, SellerId) => {
                return acc + carts[SellerId].length;               
            }, 0)}</div>
            <ul>
                {Object.keys(carts).map((SellerId) => 
                carts[SellerId].map((product)=> 
                <li key={product.id}>{product.productName} de {product.SellerSociety} pour {product.price} {product.currency}
                <input type='button' value='Retirer du panier' onClick={()=> 
                            window.confirm("Etes vous sur ?") &&
                            removeProduct(product)}></input>
                </li> 
                )
                )}
            </ul>
            <div>Prix total :
                {
                    Object.keys(priceByCurrency).length > 0 ?
                        <ul>
                            {
                                Object.keys(priceByCurrency).map((currency) =>
                                    priceByCurrency[currency] > 0 &&
                                    <li key={currency}>{currency} : {priceByCurrency[currency]}</li>
                                )

                            }
                        </ul>
                        :
                        <p>Panier vide</p>
                }
             </div>
        </div>
    );
}

export default ProductList;