import React, {createContext, useState, useEffect, useCallback} from 'react';
import ConversionService from '../services/ConversionService';
import SellerService from '../services/SellerService';

export const ProductContext = createContext();

const defaultList = [
    {
        id: 1,
        productName: "Tablette graphique",
        price: 230,
        nbPurchase: 0
    },
    {
        id: 2,
        productName: "The Elder Scrolls VI",
        price: 60,
        nbPurchase: 0
    },
    {
        id: 3,
        productName: "One Piece 100",
        price: 10,
        nbPurchase: 0
    }
]

const rand = (a, b) => a + Math.floor(Math.random()*(b - a + 1));

const round = (n, p) => Math.round(n*10**p)/10**p;

export function ProductProvider({children}) {

    const [list, setList] = useState([]);

    const [carts, setCarts] = useState({});

    const [priceByCurrency, setPriceByCurrency] = useState({});

    useEffect(() => {
        Promise.all([
            SellerService.getSellers(),
            ConversionService.getConversionRate()
        ])
        .then (([sellers, conversionRates]) => 
            setList(defaultList.map(product => {
                const seller = sellers[rand (0, sellers.length -1)];
                return {
                    ...product,
                    SellerId: seller.id,
                    SellerSociety: seller.society,
                    currency : seller.currency,
                    price: round(product.price*conversionRates.find(conversionRate =>
                        conversionRate.targetCurrency === seller.currency).rate, 2)
                }
            }
            ))
        )
    }, []);

    const buyProduct = useCallback(
        (product) => setList(list.map(item =>
            item.id === product.id ? {...product, nbPurchase: product.nbPurchase + 1} : item ))
            | setCarts({...carts, [product.SellerId] : 
                carts[product.SellerId] ? [...carts[product.SellerId], product] : [product]
            })
            | setPriceByCurrency({...priceByCurrency, [product.currency] : 
                priceByCurrency[product.currency] ? 
                round(priceByCurrency[product.currency] + product.price, 2) : product.price}),
        [list,carts,priceByCurrency]
    );

    const removeProduct = useCallback(
        (product) => setList(list.map(item =>
            item.id !== product.id ? item : {...product, nbPurchase: product.nbPurchase - 1}))
            | setCarts({...carts, [product.SellerId] :
            carts[product.SellerId].filter(item => 
                item.id !== product.id)})
            | setPriceByCurrency({...priceByCurrency, [product.currency] :
            round(priceByCurrency[product.currency] - product.price, 2)
            }),
        [list,carts,priceByCurrency]
    );

    return(
        <ProductContext.Provider value={{ list, carts, priceByCurrency, buyProduct, removeProduct }}>
            {children}
        </ProductContext.Provider>
    )    
}