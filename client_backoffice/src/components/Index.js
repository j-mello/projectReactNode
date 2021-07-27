import React, {useContext, useState} from 'react';
import {ChartBar, ChartLine} from './Charts/Index';
import {SellerContext} from "../contexts/SellerContext";
import {SessionContext} from "../contexts/SessionContext";

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button} from "@material-ui/core";

export default function Index() {
    const [errors, setErrors] = useState([]);

    const {user} = useContext(SessionContext);
    const {sellers, validSeller, setSellerToDisplay, sellerToDisplay} = useContext(SellerContext);


    const classes = makeStyles({
        table: {
            minWidth: 90,
        }
    });

    return (
        <div>
            {
                user == null &&
                <h1 style={{textAlign: "center"}}>Vous n'êtes pas connecté</h1>
            }
            {
                user != null &&
                <>
                    <h1 style={{
                        textAlignVertical: "center",
                        textAlign: "center"
                    }}>Dashboard{sellerToDisplay && " de " + sellerToDisplay.society}</h1>
                    <ChartBar/>
                    <ChartLine/>
                    {
                        user.SellerId == null &&
                        <>
                            <h1 style={{textAlignVertical: "center", textAlign: "center",}}>Voici la liste des marchands
                                :</h1>
                            <TableContainer component={Paper}>
                                {
                                    sellerToDisplay != null &&
                                    <div style={{textAlign: "center"}}>
                                        <Button
                                            onClick={() => setSellerToDisplay(null) | window.scrollTo(0, 0)}
                                            value="Afficher tout le monde"
                                            variant="contained"
                                            color="primary">
                                            Afficher tout le monde
                                        </Button>
                                    </div>
                                }
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell align="center">Siren</TableCell>
                                            <TableCell align="center">Société</TableCell>
                                            <TableCell align="center">Url de redirection</TableCell>
                                            <TableCell align="center">Url d'annulation</TableCell>
                                            <TableCell align="center">Devise</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            sellers.length > 0 ?
                                                sellers.map(seller =>
                                                    <TableRow key={seller.id}>
                                                        <TableCell component="th" scope="row">
                                                            {seller.id}
                                                        </TableCell>
                                                        <TableCell align="center">{seller.siren}</TableCell>
                                                        <TableCell align="center">{seller.society}</TableCell>
                                                        <TableCell
                                                            align="center">{seller.urlRedirectConfirm}</TableCell>
                                                        <TableCell align="center">{seller.urlRedirectCancel}</TableCell>
                                                        <TableCell align="center">{seller.currency}</TableCell>
                                                        <TableCell align="right">
                                                            {
                                                                !seller.active ?
                                                                    <Button
                                                                        onClick={() => window.confirm('Voulez vous le valider?') && validSeller(seller)}
                                                                        value="Valider"
                                                                        variant="contained"
                                                                        color="primary">
                                                                        Valider
                                                                    </Button>
                                                                    :
                                                                    (!sellerToDisplay || sellerToDisplay.id !== seller.id) ?
                                                                        <Button
                                                                            onClick={() => setSellerToDisplay(seller) | window.scrollTo(0, 0)}
                                                                            value="Afficher"
                                                                            variant="contained"
                                                                            color="primary">
                                                                            Afficher
                                                                        </Button> :
                                                                        <>Affiché</>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ) :
                                                <TableRow>
                                                    <TableCell align="center">Aucun marchand trouvé</TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <ul>
                                {
                                    errors.map((error, index) =>
                                        <li key={index} style={{color: 'red'}}>{error}</li>
                                    )
                                }
                            </ul>
                        </>
                    }
                </>
            }
        </div>
    )
}
