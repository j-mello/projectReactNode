import React, {useContext} from 'react';
import FormService from "../services/FormService";
import ShowCredential from "./ShowCredential";
import {CredentialsContext} from "../contexts/CredentialsContext";
import {SessionContext} from "../contexts/SessionContext";

function Credentials() {
	const {user} = useContext(SessionContext);
	const {credentials,errors, generateCredential} = useContext(CredentialsContext);

	return (
		<>
			<h2>Les credentials</h2>
			<ul>
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
			<input type="button" onClick={generateCredential} value="Créer"/>
			{
				FormService.displayErrors(errors)
			}
		</>
	)
}

export default Credentials;
