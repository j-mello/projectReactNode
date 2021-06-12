import React, { useState, useEffect } from 'react';
import SellerService from "../services/SellerService";

export default function Index() {
    const [sellers, setSellers] = useState([]);
    const [errors, setErrors] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    const getAllSellers = () => {
        SellerService.getSellers(user.access_token)
            .then(res => res.json())
            .then(sellers => setSellers(sellers));
    }

    useEffect(() => {
        if (user != null) {
            getAllSellers();
        }
    }, [])

    const validSeller = sellerToValid =>
        SellerService.validSeller(user.access_token,sellerToValid.id).then(res =>
            res.errors ? setErrors(res.errors) : setSellers(sellers.map(seller =>
                seller.id === sellerToValid.id ? {...sellerToValid, validated: true} : seller
            ))
        )

    return (
        <div>
            {
                user == null &&
                    <h1>Vous n'êtes pas connecté</h1>
            }
            {
                user != null && user.Seller == null &&
                    <>
                        <h1>Voici la liste des marchants :</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Siren</th>
                                    <th>Société</th>
                                    <th>Url de redirection</th>
                                    <th>Url d'annulation</th>
                                    <th>Devise</th>
                                    <th>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                sellers.map(seller =>
                                    <tr key={seller.id}>
                                        <td>{seller.siren}</td>
                                        <td>{seller.society}</td>
                                        <td>{seller.urlRedirectConfirm}</td>
                                        <td>{seller.urlRedirectCancel}</td>
                                        <td>{seller.currency}</td>
                                        {
                                            !seller.validated &&
                                            <td><input type="button" value="Valider" onClick={() => window.confirm('Voulez vous le valider?') && validSeller(seller)}/></td>
                                        }
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                        <ul>
                            {
                                errors.map((error,index) =>
                                    <li key={index} style={{color: 'red'}}>{error}</li>
                                )
                            }
                        </ul>
                    </>
            }
        </div>
    )
}