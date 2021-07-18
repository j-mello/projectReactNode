import React, {createContext, useState, useEffect, useCallback} from 'react';

export const ListContext = createContext();

const defaultList = [
    {
        id: 1,
        nom: "Tablette graphique",
        prix: 230,
        currency: "USD",
        nbPurchase: 0
    },
    {
        id: 2,
        nom: "The Elder Scrolls VI",
        prix: 60,
        currency: "EUR",
        nbPurchase: 0
    },
    {
        id: 3,
        nom: "One Piece 100",
        prix: 1000,
        currency: "JPY",
        nbPurchase: 0
    }
]

export function ListProvider({children}) {

    const [list, setList] = useState([])

    useEffect(() => {
        setList(defaultList);
    }, []);

    const buyProduct = useCallback(
        (product) => setList(list.map(item =>
            item.id == product.id ? {...product, nbPurchase: product.nbPurchase + 1} : item )),
        [list]
    );

    return(
        <ListContext.Provider value={{ list, buyProduct }}>
            {children}
        </ListContext.Provider>
    )    
}