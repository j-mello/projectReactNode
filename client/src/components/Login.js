import React from 'react';
import AuthService from "../services/AuthService";
import FormService from "../services/FormService";
import { useState } from "react";
import Form from "./Form";
import LoginForm from "../forms/LoginForm";

function Login() {

    const [ errors, setErrors ] = useState([])

    const login = async (values) => {
        const res = await AuthService.login(values);
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
                        <Form onSubmit={login} submitLabel="Connexion" model={LoginForm}>
                        </Form>
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
