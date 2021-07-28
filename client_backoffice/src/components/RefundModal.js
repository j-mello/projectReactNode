import React, {useContext, useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Modal from "./lib/Modal";
import {TransactionContext} from "../contexts/TransactionContext";

const RefundModal = ({transaction, setTransaction}) => {

    const { handleRefund } = useContext(TransactionContext);
    const [amountToRefund, setAmountToRefund] = useState(0);
    const [failed, setFailed] = useState(false);

    useEffect(() => setFailed(false) | setAmountToRefund(0), [transaction]);

    return(
            <Modal open={transaction !== null} onClose={() => setTransaction(null)}>
                <div className="container my-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="d-flex flex-column text-center">
                                <h3>Rembousement</h3>
                                { failed &&
                                    <div className="alert alert-danger" role="alert">
                                        Une erreur est survenue
                                    </div>
                                }
                                <TextField id="outlined-basic" className="my-3" label="Montant" variant="filled" value={amountToRefund}
                                           onChange={(event) => setAmountToRefund(event.target.value)} />
                                <Button variant="contained" color="primary" onClick={ async () => await handleRefund(transaction, amountToRefund) ? setTransaction(null) : setFailed(true)}>
                                    Soumettre
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
    )
}

export default RefundModal;