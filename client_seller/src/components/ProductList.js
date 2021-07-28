import React, {useContext} from 'react';
import {ProductContext} from '../contexts/ProductContext';
import {Button} from '@material-ui/core';

function ProductList() {

    const {
        list, buyProduct, carts, priceByCurrency, removeProduct, payTransactions
    } = useContext(ProductContext);

    return (
        <div>
            <h1>Voici la liste des produits</h1>
            <ul style={{listStyle: "none"}}>
                {list.map((item) =>
                    <li key={item.id} style={{paddingBottom: "5px"}}>
                        <span>{item.name} </span>
                        <span>{item.price} </span>
                        <span>{item.currency} </span>
                        <span>Societé : {item.SellerSociety} </span>
                        <Button
                            onClick={() => buyProduct(item)}
                            variant="contained"
                            color="primary"
                            style={{marginLeft: "10px"}}>
                            Acheter
                        </Button>
                    </li>
                )}
            </ul>
            <div>Nombre élements du panier : {Object.keys(carts).reduce((acc, SellerId) => {
                return acc + carts[SellerId].reduce((acc, product) =>
                    acc + product.quantity
                    , 0);
            }, 0)}</div>
            <ul style={{listStyle: "none"}}>
                {Object.keys(carts).map((SellerId) =>
                    carts[SellerId].map((product) =>
                        product.quantity > 0 &&
                        <li key={product.id} style={{paddingBottom: "5px"}}>
                            {product.name} de {product.SellerSociety} pour {product.price} {product.currency}
                            {
                                product.quantity > 1 &&
                                <> ({product.quantity})</>
                            }
                            <Button
                                onClick={() => removeProduct(product)}
                                variant="contained"
                                color="primary"
                                style={{marginLeft: "10px"}}>
                                Retirer du panier
                            </Button>
                        </li>
                    )
                )}
            </ul>
            <div>Prix total :
                {
                    Object.keys(priceByCurrency).reduce((acc, currency) =>
                        acc + priceByCurrency[currency]
                        , 0) > 0 ?
                        <>
                            <ul style={{ listStyle: "none"}}>
                                {
                                    Object.keys(priceByCurrency).map((currency) =>
                                        priceByCurrency[currency] > 0 &&
                                        <li key={currency}>{currency} : {priceByCurrency[currency]}</li>
                                    )

                                }
                            </ul>
                            <Button
                                onClick={payTransactions}
                                variant="contained"
                                color="primary"
                                style={{marginLeft: "10px"}}>
                                Payer
                            </Button>
                        </>
                        :
                        <p>Panier vide</p>
                }
            </div>
        </div>
    );
}

export default ProductList;