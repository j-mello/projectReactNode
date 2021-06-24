import React from 'react';
import Form from "./Form";
import SellerForm from "../forms/SellerForm";

function SellerInfos() {
	const user = JSON.parse(localStorage.getItem("user"));

	if (user == null || user.Seller == null) return;

	const changeSellerInfos = (values) => {
		console.log(values);
		window.alert("Change infos");
	}

	return <div>
		<h1>Vos informations personnelles</h1>
		<Form model={SellerForm(false)} dataValues={{...user.Seller, ...user}} submitLabel="Modifier" onSubmit={changeSellerInfos}>
		</Form>
	</div>
}

export default SellerInfos;
