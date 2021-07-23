import { useContext, useEffect, useState } from 'react';
import { ListContext } from "../contexts/ListContext"
import TransactionService from "../services/TransactionService";
import PropTypes from 'prop-types';
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


const Transactions = () => {

    const { list, setList } = useContext(ListContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => TransactionService.getTransactions().then(data => setList(data)), []);

    return (
        <div>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (<Row key={row._id} row={row}/>))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}

function Row({ row }) {

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
            <TableCell align="right">{row.updatedAt}</TableCell>
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
                </Collapse>
            </TableCell>
        </TableRow>
    </>)
}

export default Transactions;