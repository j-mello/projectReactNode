import React from 'react';
import Form from "./lib/Form";
import Credentials from "./Credentials";
import SellerForm from "../forms/UserForm";
import AuthService from "../services/AuthService";
import {useState} from "react";
import FormService from "../services/FormService";
import PasswordForm from "../forms/PasswordForm";
import {CredentialsProvider} from "../contexts/CredentialsContext";

function Infos() {
	const user = JSON.parse(localStorage.getItem("user"));
	const [successOrErrors, setSuccessOrErrors] = useState(null);
	const [successOrErrorsPassword, setSuccessOrErrorsPassword] = useState(null);

	if (user == null) return null;

	const changePassword = async ({password,password_confirm}) => {
		if (password !== "" && password === password_confirm) {
			const res = await AuthService.editPassword({password,password_confirm},user.access_token);
			if (res.errors) {
				setSuccessOrErrorsPassword(res.errors);
			} else {
				setSuccessOrErrorsPassword(true);
			}
		} else {
			setSuccessOrErrorsPassword(["Les mots de passe de correspondent pas"]);
		}
	}

	const changeInfos = async ({siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone}) => {
		const res = await AuthService.edit({siren,society,urlRedirectConfirm,urlRedirectCancel,currency,numPhone},user.access_token)
		if (res.errors) {
			setSuccessOrErrors(res.errors);
		} else {
			localStorage.setItem("user", JSON.stringify({
				...user,
				numPhone,
			...(user.Seller && {
				Seller: {
				...
					user.Seller,
						siren, society, urlRedirectConfirm, urlRedirectCancel, currency
				}
			})
			}))
			setSuccessOrErrors(true);
		}
	}

	return (
		<div>
			<h1>Vos informations personnelles</h1>
			<Form model={SellerForm(false, user.Seller != null)} dataValues={{...user.Seller, ...user}} submitLabel="Modifier" onSubmit={changeInfos}>
			</Form>
			{
				successOrErrors === true &&
				<p style={{color: 'green'}}>Informations modifiées avec succès!</p>
			}
			{
				successOrErrors instanceof Array &&
				FormService.displayErrors(successOrErrors)
			}

			<h2>Modifier votre mot de passe</h2>
			<Form model={PasswordForm()} submitLabel="Modifier" onSubmit={changePassword}>
			</Form>
			{
				successOrErrorsPassword === true &&
				<p style={{color: 'green'}}>Mot de passe modifié avec succès!</p>
			}
			{
				successOrErrorsPassword instanceof Array &&
				FormService.displayErrors(successOrErrorsPassword)
			}
			{ user.Seller != null &&
				<CredentialsProvider>
					<Credentials>
					</Credentials>
				</CredentialsProvider>
			}
		</div>)
}

export default Infos;
