import React, {useState,useContext,useCallback} from 'react';
import {SessionContext} from "../contexts/SessionContext";

function Login() {
    const {login,loginFailed} = useContext(SessionContext);
    const [values, setValues] = useState({
        clientId: '',
        clientSecret: ''
    });

    const handleChange = useCallback((e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }, [values])

    const connect = useCallback(
        (e) => {
            e.preventDefault();
            login(values);
        }, [login,values]
    )

    return (
        <>
            <h1>Connexion marchand</h1>
            <form onSubmit={connect}>
                <label>
                    Client id :
                    <input name="clientId" type="text" value={values.clientId} onChange={handleChange}/>
                </label><br/>
                <label>
                    Client secret :
                    <input name="clientSecret" type="text" value={values.clientSecret} onChange={handleChange}/>
                </label><br/>
                <input type="submit" value="Connexion"/>
            </form>
            {
                loginFailed &&
                    <p style={{color: 'red'}}>Echec de connexion</p>
            }
        </>
    )
}

export default Login;