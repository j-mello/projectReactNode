import React from 'react';
import AuthService from "../services/AuthService";
import FormService from "../services/FormService";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "./Form";
import SellerForm from "../forms/SellerForm";

function RegisterSeller() {

    const history = useHistory();

    const [ errorsOrSuccess, setErrorsOrSuccess ] = useState(false);

    const register = async (values) => {
        const res = await AuthService.registerSeller(values);
        if (res) {
            setErrorsOrSuccess(res.success ? true : res.errors);
            if (res.success) {
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
                        <div className="card-header"><h2>Inscription marchant</h2></div>
                        <Form onSubmit={register} submitLabel="S'inscrire" model={SellerForm()}>
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
