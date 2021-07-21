import React from 'react';
import AuthService from "../services/AuthService";
import FormService from "../services/FormService";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "./lib/Form";
import UserForm from "../forms/UserForm";

function RegisterSeller() {

    const history = useHistory();

    const [ errorsOrSuccess, setErrorsOrSuccess ] = useState(false);

    const register = async (values) => {
        const res = await AuthService.registerSeller(values);
        if (res) {
            setErrorsOrSuccess(res.errors ?? true);
            if (res.errors === undefined) {
                setTimeout(() => {
                    history.push("/");
                }, 500);
            }
        }
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card text-center">
                        <div className="card-header"><h2>Inscription marchand</h2></div>
                        <Form onSubmit={register} submitLabel="S'inscrire" model={UserForm(true,true)}>
                        </Form>
                        {
                            Array.isArray(errorsOrSuccess) &&
                            FormService.displayErrors(errorsOrSuccess)
                        }
                        {
                            errorsOrSuccess === true &&
                            <div style={{color: "green"}}>Inscription réussie!!</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterSeller;
