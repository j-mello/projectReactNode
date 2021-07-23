import React, {createContext, useState, useEffect, useCallback} from 'react';
import SellerService from "../services/SellerService";

export const SellerContext = createContext();

export default function SellerProvider({ children, user }) {
    const [sellers, setSellers] = useState([])
    const [sellerToDisplay, setSellerToDisplay] = useState(null)

    const validSeller = useCallback(sellerToValid => setSellers(sellers.map(seller =>
        seller.id === sellerToValid.id ? {...sellerToValid, active: true} : seller
    )), [sellers] )

    useEffect(() => {
        setSellerToDisplay((user && user.SellerId) ? user.Seller : null)
    }, [user])

    useEffect(()=>{
        SellerService.getSellers().then((sellers)=>setSellers(sellers))
    },[])

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