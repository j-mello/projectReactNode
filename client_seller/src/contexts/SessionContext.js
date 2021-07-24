import React,{createContext,useState,useEffect,useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import SessionService from "../services/SessionService";

export const SessionContext = createContext();


export default function SessionProvider({children}) {
    const [seller,setSeller] = useState(null);
    const [loginFailed,setLoginFailed] = useState(false)

    const history = useHistory();

    useEffect(() => {
        setSeller(JSON.parse(localStorage.getItem("seller")))
    }, [])

    const login = useCallback(
        (values) => SessionService.login(values)
            .then(res => res.status === 200 ?
                    res.json().then(seller => localStorage.setItem("seller",JSON.stringify(seller)) | history.push("/") | setSeller(seller)):
                    setLoginFailed(true)),
        [seller]
    )

    const logout = useCallback(
        ({accessToken}) => SessionService.logout(accessToken)
            .then(res => res.status === 200 && (localStorage.removeItem("seller") | history.push("/") | setSeller(null))),
        [seller]
    )

    return (
        <SessionContext.Provider value={{seller,loginFailed,login,logout}}>
            {children}
        </SessionContext.Provider>
    )
}