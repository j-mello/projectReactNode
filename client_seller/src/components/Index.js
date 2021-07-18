import React from 'react';
import List from './List';
import {ListProvider} from '../contexts/ListContext';


function Index() {
    const seller = JSON.parse(localStorage.getItem('seller'));
    console.log(seller);
    return (
        <div>
            <h1>Site marchand</h1>
            { seller == null && 
                <ListProvider>
                    <List>
                        
                    </List>
                </ListProvider> }
        </div>
    )
}

export default Index;