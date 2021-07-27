import React, {useContext} from 'react';
import FormService from "../services/FormService";
import ShowCredential from "./ShowCredential";
import {CredentialsContext} from "../contexts/CredentialsContext";
import {Button} from "@material-ui/core";

function Credentials() {
    const {credentials, errors, generateCredential} = useContext(CredentialsContext);

    return (
        <>
            <h2>Les credentials</h2>
            {
                FormService.displayErrors(errors)
            }
            <ul style={{listStyle: "none"}}>
                {
                    credentials.length > 0 ?
                        credentials.map(credential =>
                            <li key={credential.id}>
                                <ShowCredential credential={credential}>
                                </ShowCredential>
                            </li>
                        )
                        :
                        <p>Aucun crédential trouvé</p>
                }
            </ul>
            <Button
                type="submit"
                onClick={generateCredential}
                variant="contained"
                color="primary"
                style={{marginBottom: "20px"}}>
                Créer
            </Button>
        </>
    )
}

export default Credentials;
