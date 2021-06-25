import React, {useState} from 'react';
import SellerService from "../services/SellerService";
import FormService from "../services/FormService";

function Credentials() {
	const user = JSON.parse(localStorage.getItem("user"));

	const [values, setValues] = useState({
		clientId: user && user.Seller && user.Seller.ClientCredential && user.Seller.ClientCredential.clientId,
		clientSecret: user && user.Seller && user.Seller.ClientCredential && user.Seller.ClientCredential.clientSecret,
	});
	const [successOrErrors, setSuccessOrErrors] = useState(null);

	if (user == null || user.Seller == null || user.Seller.ClientCredential == null) return;

	const reGenerateCredentials = () => {
		SellerService.reGenerateCredentials(user.access_token,user.SellerId).then(res =>
			res.success ?
				setValues(res) | setSuccessOrErrors(true) |
				localStorage.setItem("user", JSON.stringify({
					...user,
					Seller: {
						...user.Seller,
						ClientCredential: res
					}
				})) :
				setSuccessOrErrors(res.errors)
		)
	}

	return (
		<>
			<h2>Les credentials</h2>
			<label>
				Le client id :
				<input value={values.clientId} disabled="disabled"/>
			</label><br/>
			<label>
				Le client secret :
				<input value={values.clientSecret} disabled="disabled"/>
			</label><br/>
			<input type="button" value="Regénérer" onClick={reGenerateCredentials}/>
			{
				successOrErrors === true &&
				<p style={{color: 'green'}}>Crédentials régénérés</p>
			}
			{
				successOrErrors instanceof Array &&
					FormService.displayErrors(successOrErrors)
			}
		</>
	)
}

export default Credentials;
