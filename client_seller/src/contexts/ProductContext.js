import React, {createContext, useState, useEffect, useCallback} from 'react';
import ConversionService from '../services/ConversionService';
import SellerService from '../services/SellerService';
import TransactionService from '../services/TransactionService';

export const ProductContext = createContext();

const defaultList = [
    {
        id: 1,
        name: "Tablette graphique",
        price: 230
    },
    {
        id: 2,
        name: "The Elder Scrolls VI",
        price: 60
    },
    {
        id: 3,
        name: "One Piece 100",
        price: 10
    },
    {
        id: 4,
        name: "Batman Arkham World",
        price: 70
    },
    {
        id: 5,
        name: "Poutine fondante",
        price: 8
    }
]

const rand = (a, b) => a + Math.floor(Math.random()*(b - a + 1));

const round = (n, p) => Math.round(n*10**p)/10**p;

export function ProductProvider({children,seller}) {

    const [list, setList] = useState([]);

    const [carts, setCarts] = useState({});

    const [priceByCurrency, setPriceByCurrency] = useState({});

    useEffect(() => {
        if (seller == null) {
            Promise.all([
                SellerService.getSellers(),
                ConversionService.getConversionRate()
            ])
                .then(([sellers, conversionRates]) =>
                    setList(defaultList.map(product => {
                        const seller = sellers[rand(0, sellers.length - 1)];
                        const conversionRate = conversionRates.find(conversionRate =>
                            conversionRate.targetCurrency === seller.currency);
                        return {
                            ...product,
                            SellerId: seller.id,
                            SellerSociety: seller.society,
                            currency: seller.currency,
                            price: conversionRate ? round(product.price * conversionRate.rate, 2) : product.price
                        }
                    }))
                )
        }
    }, [seller]);

    const buyProduct = useCallback(
        (product) =>
            setCarts({...carts, [product.SellerId] :
                carts[product.SellerId] ? 
                    carts[product.SellerId].find((item) => item.id === product.id ) ?
                        carts[product.SellerId].map((item) =>
                            item.id === product.id ?
                                {
                                    ...item,
                                    quantity: item.quantity + 1
                                } :
                                item)
                        : [...carts[product.SellerId], {...product, quantity: 1}] :
                    [{...product, quantity: 1}]
            })
            | setPriceByCurrency({...priceByCurrency, [product.currency] : 
                priceByCurrency[product.currency] ? 
                round(priceByCurrency[product.currency] + product.price, 2) : product.price}),
        [list,carts,priceByCurrency]
    );

    const payTransactions = useCallback(
        () =>
            window.location.href = "http://"+window.location.hostname+
            ":3001/payment?carts="+JSON.stringify(carts)+"&redirectUrl="+window.location.href
    )

    const removeProduct = useCallback(
        (product) =>
            setCarts({...carts,
                [product.SellerId]: carts[product.SellerId].map(item =>
                    item.id !== product.id ? item :
                    {
                        ...item,
                        quantity: item.quantity - 1
                    })
            }) |
            setPriceByCurrency({...priceByCurrency,
                [product.currency]: round(priceByCurrency[product.currency] - product.price, 2)
            }),
        [list,carts,priceByCurrency]
    );

    return(
        <ProductContext.Provider value={{ list, carts, priceByCurrency, buyProduct, removeProduct, payTransactions }}>
            {children}
        </ProductContext.Provider>
    )    
}