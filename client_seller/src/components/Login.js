import React, {useCallback, useContext, useState} from 'react';
import {SessionContext} from "../contexts/SessionContext";
import {Button, TextField} from "@material-ui/core";

function Login() {
    const {login, loginFailed} = useContext(SessionContext);
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
        }, [login, values]
    )

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card text-center">
                            <div className="card-header"><h2>Connexion marchand</h2></div>
                            {
                                loginFailed &&
                                <p style={{color: 'red'}}>Echec de connexion</p>
                            }
                            <form onSubmit={connect} style={{marginTop: "10px"}}>
                                <div>
                                    <TextField
                                        id="outlined-basic"
                                        label="Cliend Id"
                                        variant="outlined"
                                        name="clientId"
                                        type="text"
                                        value={values.clientId}
                                        onChange={handleChange}
                                        style={{padding: "15px 0px", width: "25rem"}}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        id="outlined-basic"
                                        label="Client Secret"
                                        variant="outlined"
                                        name="clientSecret"
                                        type="text"
                                        value={values.clientSecret}
                                        onChange={handleChange}
                                        style={{padding: "15px 0px", width: "25rem"}}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    value="Connexion"
                                    variant="contained"
                                    color="primary"
                                    style={{marginBottom: "20px"}}>
                                    Valider
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Login;