import React, {useContext, useEffect, useState} from 'react';
import Form from "./lib/Form";
import Credentials from "./Credentials";
import SellerForm from "../forms/UserForm";
import FormService from "../services/FormService";
import PasswordForm from "../forms/PasswordForm";
import {CredentialsProvider} from "../contexts/CredentialsContext";
import ConversionService from "../services/ConversionService";
import {SessionContext} from "../contexts/SessionContext";

function Infos() {
    const {user,successOrErrors,successOrErrorsPassword,changePassword,changeInfos} = useContext(SessionContext);
    const [dataValues, setDataValues] = useState({});
    const [currencies, setCurrencies] = useState([]);

	useEffect(() => {
		ConversionService.getConversionRate()
			.then(conversionRates => setCurrencies(conversionRates.map(conversionRate => conversionRate.targetCurrency)))
	}, []);


	useEffect(() => {
		if (user !== null) {
			setDataValues({...user.Seller, ...user})
		}
	}, [user])

	return ( user != null &&
		<div style={{textAlign: "center"}}>
			<h1>Vos informations personnelles</h1>
		
      <Form model={SellerForm(false, user.Seller != null, currencies)} dataValues={dataValues} submitLabel="Modifier" onSubmit={changeInfos}>
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
