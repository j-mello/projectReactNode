import React from 'react';
import AuthService from "../services/AuthService";
import FormService from "../services/FormService";
import { useState } from "react";

function Login() {

    const [ fields, setFields ] = useState({
        email: "",
        password: ""
    });

    const [ errors, setErrors ] = useState([])

    const handleChange = (event) => {
        setFields({...fields, [event.target.name]: event.target.value});
    }

    const login = async (e) => {
        e.preventDefault()
        const res = await AuthService.login(fields.email,fields.password);
        if (res) {
            setErrors(res.errors);
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card text-center">
                        <div className="card-header"><h2>Connexion</h2></div>
                        <form onSubmit={login}>
                            <input name="email" placeholder="Adresse mail" type="text" onChange={handleChange} value={fields.email}/><br/>
                            <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} value={fields.password}/><br/>
                            <input type="submit" value="Connexion"/>
                        </form>
                        {
                            FormService.displayErrors(errors)
                        }
                    </div>
                </div>
            </div>
        </div>
        );
}

export default Login;
