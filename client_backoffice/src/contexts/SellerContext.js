import React, {createContext, useCallback, useEffect, useState} from 'react';
import SellerService from "../services/SellerService";

export const SellerContext = createContext();

export default function SellerProvider({children, user}) {
    const [sellers, setSellers] = useState([])
    const [sellerToDisplay, setSellerToDisplay] = useState(null)

    const validSeller = useCallback(sellerToValid =>
        SellerService.validSeller(sellerToValid.id).then(() =>
            setSellers(sellers.map(seller =>
                seller.id === sellerToValid.id ? {...sellerToValid, active: true} : seller)
            )
        ), [sellers])

    useEffect(() => {
        setSellerToDisplay((user && user.SellerId) ? user.Seller : null)
        if (user) {
            SellerService.getSellers().then((sellers) => setSellers(sellers));
        } else {
            setSellers([]);
        }
    }, [user]);

    return (
        <SellerContext.Provider
            value={{
                sellers,
                sellerToDisplay,
                setSellerToDisplay,
                validSeller
            }}
        >
            {children}
        </SellerContext.Provider>
    );
}