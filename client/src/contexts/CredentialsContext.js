import {createContext, useState, useEffect, useCallback} from 'react';
import CredentialService from "../services/CredentialService";

export const CredentialsContext = createContext();

export function CredentialsProvider({children}) {
    const [credentials,setCredentials] = useState([]);
    const [errors,setErrors] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        CredentialService.getCredentials(user.access_token)
            .then(res => res.errors ? setErrors(res.errors) : setCredentials(res));
    }, []);

    const removeCredential = useCallback(
        (credentialToDelete) =>
            CredentialService.removeCredential(user.access_token,credentialToDelete.id)
            .then(res =>
                res.errors ?
                    setErrors(res.errors) :
                    setCredentials(credentials.filter(credential => credential.id !== credentialToDelete.id))
            )
        [credentials]
    )
    const generateCredential = useCallback(
        () => CredentialService.generateCredential(user.access_token)
            .then(
                res => res.errors ?
                    setErrors(res.errors) :
                    setCredentials([...credentials, res])
            ),
        [credentials]
    );
    const regenerateCredential = useCallback(
        (credentialToUpdate) => CredentialService.regenerateCredential(user.access_token,credentialToUpdate.id)
            .then(
                res => res.errors ?
                    setErrors(res.errors) :
                    setCredentials(credentials.map(credential =>
                        credential.id === credentialToUpdate.id ?
                            res : credential
                    ))
            ),
        [credentials]
    )

    return (
        <CredentialsContext.Provider value={{credentials, errors, removeCredential, generateCredential, regenerateCredential}}>
            {children}
        </CredentialsContext.Provider>
    )
}