import React, {createContext, useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import AuthService from "../services/AuthService";

export const SessionContext = createContext();

export default function SessionProvider({children}) {
    const [user, setUser] = useState(null);
    const [loginErrors, setLoginErrors] = useState([]);
    const [successOrErrors, setSuccessOrErrors] = useState(null);
    const [successOrErrorsPassword, setSuccessOrErrorsPassword] = useState(null);

    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem("user"))
            setUser(JSON.parse(localStorage.getItem("user")))
    }, []);

    const login = useCallback(
        (values) => AuthService.login(values)
            .then(res => res.errors ?
                setLoginErrors(res.errors) :
                (setLoginErrors([]) | localStorage.setItem("user",JSON.stringify(res)) | history.push('/') | setUser(res))
            ),
        [user,loginErrors]
    )

    const logout = useCallback(
        () =>  user == null ?
            window.alert("Vous êtes déjà déconnecté") :
                window.confirm("Voulez vous vous déconnecter ?") &&
                (localStorage.removeItem("user") | history.push('/') | setUser(null)),
            [user,loginErrors]
    )

    const changePassword = useCallback(async ({password,password_confirm}) => {
        if (password !== "" && password === password_confirm) {
            const res = await AuthService.editPassword({password,password_confirm},user.access_token);
            if (res.errors) {
                setSuccessOrErrorsPassword(res.errors);
            } else {
                setSuccessOrErrorsPassword(true);
            }
        } else {
            setSuccessOrErrorsPassword(["Les mots de passe de correspondent pas"]);
        }
    }, [])

    const changeInfos = useCallback(async ({siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone}) => {
        const res = await AuthService.edit({siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone},user.access_token)
        if (res.errors) {
            setSuccessOrErrors(res.errors);
        } else {
            const newUser = {
                ...user,
                numPhone,
                ...(user.Seller && {
                    Seller: {
                        ...
                            user.Seller,
                        siren, society, urlRedirectConfirm, urlRedirectCancel, currency
                    }
                })
            }
            localStorage.setItem("user", JSON.stringify(newUser))
            setUser(newUser);
            setSuccessOrErrors(true);
        }
    }, [user])

    return (
        <SessionContext.Provider value={{user,loginErrors,login,logout,successOrErrors,successOrErrorsPassword,changePassword,changeInfos}}>
            {children}
        </SessionContext.Provider>
    )
}