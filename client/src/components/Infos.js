import React from 'react';
import Form from "./Form";
import SellerForm from "../forms/SellerForm";
import AuthService from "../services/AuthService";
import { useState } from "react";
import FormService from "../services/FormService";

function Infos() {
	const user = JSON.parse(localStorage.getItem("user"));

	const [successOrErrors, setSuccessOrErrors] = useState(null);

	if (user == null || user.Seller == null) return;

	const changeSellerInfos = async ({siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone}) => {
		const res = await AuthService.edit({siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone},user.access_token)
		if (res.success) {
			localStorage.setItem("user", JSON.stringify({
				...user,
				numPhone,
				Seller: {
					...user.Seller,
					siren,society,urlRedirectConfirm,urlRedirectCancel,currency
				}
			}))
			setSuccessOrErrors(true);
		} else {
			setSuccessOrErrors(res.errors);
		}
	}

	return <div>
		<h1>Vos informations personnelles</h1>
		<Form model={SellerForm(false)} dataValues={{...user.Seller, ...user}} submitLabel="Modifier" onSubmit={changeSellerInfos}>
		</Form>
		{
			successOrErrors === true &&
				<p style={{color: 'green'}}>Informations modifiées avec succès!</p>
		}
		{
			successOrErrors instanceof Array &&
				FormService.displayErrors(successOrErrors)
		}
	</div>
}

export default Infos;
