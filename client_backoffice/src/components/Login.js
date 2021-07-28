import React, {useContext} from 'react';
import FormService from "../services/FormService";
import Form from "./lib/Form";
import LoginForm from "../forms/LoginForm";
import {SessionContext} from "../contexts/SessionContext";

function Login() {

    const {login, loginErrors} = useContext(SessionContext);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card text-center">
                        <div className="card-header"><h2>Connexion</h2></div>
                        {
                            FormService.displayErrors(loginErrors)
                        }
                        <Form onSubmit={login} submitLabel="Connexion" model={LoginForm()}>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
