import React, {createContext, useState, useEffect, useCallback} from 'react';

export const ProductContext = createContext();

const defaultList = [
    {
        id: 1,
        productName: "Tablette graphique",
        price: 230,
        currency: "USD",
        nbPurchase: 0
    },
    {
        id: 2,
        productName: "The Elder Scrolls VI",
        price: 60,
        currency: "EUR",
        nbPurchase: 0
    },
    {
        id: 3,
        productName: "One Piece 100",
        price: 1000,
        currency: "JPY",
        nbPurchase: 0
    }
]

export function ProductProvider({children}) {

    const [list, setList] = useState([]);

    const [cart, setCart] = useState([]);

    const [priceByCurrency, setPriceByCurrency] = useState({});

    useEffect(() => {
        setList(defaultList);
    }, []);

    const buyProduct = useCallback(
        (product) => setList(list.map(item =>
            item.id == product.id ? {...product, nbPurchase: product.nbPurchase + 1} : item ))
            | setCart([...cart, product])
            | setPriceByCurrency({...priceByCurrency, [product.currency] : 
                priceByCurrency[product.currency] ? 
                priceByCurrency[product.currency] + product.price : product.price}),
        [list]
    );

    return(
        <ProductContext.Provider value={{ list, buyProduct, cart, priceByCurrency }}>
            {children}
        </ProductContext.Provider>
    )    
}