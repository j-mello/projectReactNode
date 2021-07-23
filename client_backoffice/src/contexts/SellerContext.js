import {createContext, useState, useEffect, useCallback} from 'react';
import SellerService from "../services/SellerService";

export const SellerContext = createContext();
const user = JSON.parse(localStorage.getItem("user"))

export default function SellerProvider({ children }) {
    const [sellers, setSellers] = useState([])
    const [sellerToDisplay, setSellerToDisplay] = useState((user && user.SellerId) ? user.Seller : null)
    const validSeller = useCallback(sellerToValid => setSellers(sellers.map(seller =>
        seller.id === sellerToValid.id ? {...sellerToValid, active: true} : seller
    )), [sellers] )

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