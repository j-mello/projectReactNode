import React, {useContext} from 'react';
import {CredentialsContext} from "../contexts/CredentialsContext";

function ShowCredential({credential}) {
    const {removeCredential, regenerateCredential} = useContext(CredentialsContext);

    return (
        <div>
            <label>
                Le client id :
            </label>
            <input type="text" disabled value={credential.clientId}/><br/>
            <label>
                Le client secret :
            </label>
            <input type="text" disabled value={credential.clientSecret}/><br/>
            <input type="button" onClick={() => window.confirm("Êtes vous sur de vouloir le supprimer?") && removeCredential(credential)} value="Supprimer"/>
            <input type="button" onClick={() => window.confirm("Êtes vous sur de vouloir le Regénérer?") && regenerateCredential(credential)} value="Regénérer"/>
        </div>
    )
}

export default ShowCredential;