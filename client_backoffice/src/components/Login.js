import React, {useContext} from 'react';
import AuthService from "../services/AuthService";
import FormService from "../services/FormService";
import { useState } from "react";
import Form from "./lib/Form";
import LoginForm from "../forms/LoginForm";
import {SessionContext} from "../contexts/SessionContext";

function Login() {

    const {login,loginErrors} = useContext(SessionContext);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card text-center">
                        <div className="card-header"><h2>Connexion</h2></div>
                        <Form onSubmit={login} submitLabel="Connexion" model={LoginForm()}>
                        </Form>
                        {
                            FormService.displayErrors(loginErrors)
                        }
                    </div>
                </div>
            </div>
        </div>
        );
}

export default Login;
