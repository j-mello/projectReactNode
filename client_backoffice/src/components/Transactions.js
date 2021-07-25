import {useContext, useEffect, useState} from 'react';
import { TransactionContext } from "../contexts/TransactionContext";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {SellerContext} from "../contexts/SellerContext";
import {SessionContext} from "../contexts/SessionContext";
import Button from "@material-ui/core/Button";
import { parseDate } from "../lib/utils";
import ShowHistory from "./ShowHistory";

const Transactions = () => {

    const { listTransaction } = useContext(TransactionContext);
    const { sellers, sellerToDisplay, setSellerToDisplay } = useContext(SellerContext);
    const { user } = useContext(SessionContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (event) => {
        if (event.target.value === 'null') {
            setSellerToDisplay(null)
        } else {
            setSellerToDisplay(sellers.find(seller => seller.id === parseInt(event.target.value)));
        }
    };

    return (
        <div>
            <ShowHistory selectedHistory={selectedHistory} />
            <h1>Liste des transactions { sellerToDisplay && <> de {sellerToDisplay.society}</>}</h1>
            {
                user && user.SellerId === null &&
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={sellers}
                        onChange={handleFilterChange}
                    >
                        <MenuItem value="null">
                            <em>None</em>
                        </MenuItem>
                        {
                            sellers.map(seller => (<MenuItem key={seller.id} value={seller.id}>{ seller.society }</MenuItem>))
                        }
                    </Select>
            }
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell><strong>Entreprise</strong></TableCell>
                            <TableCell align="right"><strong>Nombre d'articles</strong></TableCell>
                            <TableCell align="right"><strong>Prix total</strong></TableCell>
                            <TableCell align="right"><strong>Currency</strong></TableCell>
                            <TableCell align="right"><strong>Statut</strong></TableCell>
                            <TableCell align="right"><strong>Dernière modification</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            listTransaction
                                .filter(row => sellerToDisplay === null || row.Seller.id === sellerToDisplay.id)
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(row => (<Row key={row._id} row={row} setSelectedHistory={setSelectedHistory} />))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={listTransaction.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

function Row({ row, setSelectedHistory }) {

    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
    });

    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (<>
        <TableRow className={classes.root}>
            <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
                {row.Seller && row.Seller.society}
            </TableCell>
            <TableCell align="right">{row.cart.length}</TableCell>
            <TableCell align="right">{row.amount}</TableCell>
            <TableCell align="right">{row.currency}</TableCell>
            <TableCell align="right">{row.status}</TableCell>
            <TableCell align="right">{parseDate(row.updatedAt)}</TableCell>
            <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => setSelectedHistory([...row.TransactionHistories])}>
                    Voir historique
                </Button>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Panier
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Nom</strong></TableCell>
                                    <TableCell><strong>Quantité</strong></TableCell>
                                    <TableCell><strong>Prix</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.cart.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                    <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                            Operations
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Prix</strong></TableCell>
                                    <TableCell><strong>Statut</strong></TableCell>
                                    <TableCell><strong>Date création</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.Operations.map((operation) => (
                                    <TableRow key={operation._id}>
                                        <TableCell>{operation.price}</TableCell>
                                        <TableCell>{operation.status}</TableCell>
                                        <TableCell>{parseDate(operation.createdAt)}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" onClick={() => setSelectedHistory([...operation.OperationHistories])}>
                                                Voir historique
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    </>)
}

export default Transactions;