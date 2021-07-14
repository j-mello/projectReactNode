import React from 'react';
import List from './List';


function Index() {
    const seller = JSON.parse(localStorage.getItem('seller'));
    console.log(seller);
    return (
        <div>
            <h1>Site marchand</h1>
            { seller == null && 
                <List></List> }
        </div>
    )
}

export default Index;