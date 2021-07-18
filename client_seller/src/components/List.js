import React, {useContext} from 'react';
import {ListContext} from '../contexts/ListContext';

function List(){

    const {
        list, buyProduct
    } = useContext(ListContext);

    return (
        <div>
            <h1>Voici la liste des produits</h1>
            <ul>
                {list.map((item) => 
                    <li key={item.id}>
                        <span>{item.nom} </span>
                        <span>{item.prix} </span>
                        <span>{item.currency} </span>
                        <input type='button' value="Acheter" onClick={()=> 
                            window.confirm("C'est votre dernier mot ?") &&
                            buyProduct(item)}>
                        </input>
                        {item.nbPurchase > 0 &&
                        <span> Acheté : {item.nbPurchase} fois </span>}
                    </li>
                )}
            </ul>
        </div>
    );
}

export default List;