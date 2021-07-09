import React, {useContext} from 'react';
import FormService from "../services/FormService";
import ShowCredential from "./ShowCredential";
import {CredentialsContext} from "../contexts/CredentialsContext";

function Credentials() {
	const user = JSON.parse(localStorage.getItem("user"));
	const {credentials,errors, removeCredential, generateCredential, regenerateCredential} = useContext(CredentialsContext);


	if (user == null || user.Seller == null) return null;

	/*const reGenerateCredentials = () => {
		SellerService.reGenerateCredentials(user.access_token,user.SellerId).then(res =>
			res.errors ? setSuccessOrErrors(res.errors) :
				setValues(res) | setSuccessOrErrors(true) |
				localStorage.setItem("user", JSON.stringify({
					...user,
					Seller: {
						...user.Seller,
						ClientCredential: res
					}
				}))

		)
	}*/

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
