import React, {useContext, useEffect, useState} from "react";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Modal from "./lib/Modal";
import {TransactionContext} from "../contexts/TransactionContext";

const CompleteTransactionModal = ({transaction, setTransaction}) => {

    const { handleCapture, handleRefuse } = useContext(TransactionContext);

    return(
            <Modal open={transaction !== null} onClose={() => setTransaction(null)}>
                <div className="container my-5">
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <div className="d-flex flex-column align-items-center text-center">
                                <h3>Terminer la transaction</h3>
                                <div className="d-flex">
                                    <Button variant="contained" className="mx-1" color="primary"
                                            onClick={() => handleCapture(transaction) | setTransaction(null)}>
                                        Accepter la transaction
                                    </Button>
                                    <Button variant="contained" className="mx-1" color="secondary"
                                            onClick={() => handleRefuse(transaction) | setTransaction(null)}>
                                        Refuser la transaction
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
    )
}

export default CompleteTransactionModal;