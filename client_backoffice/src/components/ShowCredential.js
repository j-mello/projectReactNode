import React, {useContext, useEffect} from 'react';
import {CredentialsContext} from "../contexts/CredentialsContext";
import {Button, TextField} from "@material-ui/core";

function ShowCredential({credential}) {
    const {removeCredential, regenerateCredential} = useContext(CredentialsContext)

    return (
        <div style={{marginBottom: "20px"}}>
            <TextField
                disabled
                id="outlined-disabled"
                label="Cliend Id"
                value={credential.clientId}
                variant="outlined"
                style={{paddingTop: "15px", width: "25rem", marginRight: "10px"}}
            />
            <TextField
                disabled
                id="outlined-disabled"
                label="Client secret"
                value={credential.clientSecret}
                variant="outlined"
                style={{paddingTop: "15px", width: "25rem", marginRight: "10px"}}
            />
            <Button
                type="submit"
                onClick={() => window.confirm("Êtes vous sur de vouloir le supprimer?") && removeCredential(credential)}
                variant="contained"
                color="primary"
                style={{marginTop: "20px", marginRight: "10px"}}>
                Supprimer
            </Button>
            <Button
                type="submit"
                onClick={() => window.confirm("Êtes vous sur de vouloir le Regénérer?") && regenerateCredential(credential)}
                variant="contained"
                color="primary"
                style={{marginTop: "20px"}}>
                Regénérer
            </Button>
        </div>
    )
}

export default ShowCredential;