import {createContext, useCallback, useEffect, useState,} from "react";
import TransactionService from "../services/TransactionService";
import OperationService from "../services/OperationService";
import {isNumber} from "../lib/utils";

export const TransactionContext = createContext([]);

export default function TransactionProvider({children, user}) {
    const [listTransaction, setListTransaction] = useState([]);

    const handleRefund = (transactionToRefund, amount) =>
        new Promise((resolve) =>
            isNumber(amount) && OperationService.refundItem(transactionToRefund.id, amount)
                .then(data => !data.errors ? setListTransaction(listTransaction.map(transaction => {
                    if (transaction.id === transactionToRefund.id) {
                        return {
                            ...transaction,
                            Operations: [
                                ...transaction.Operations,
                                {
                                    price: parseFloat(amount),
                                    quotation: 'remboursement de ' + amount + ' ' + transactionToRefund.currency,
                                    status: transaction.Operations.reduce((acc, operation) =>
                                        operation.status === "partial_refunding" ? acc + operation.price : acc
                                    , 0) + parseFloat(amount) === transaction.amount ? "refunding" : "partial_refunding",
                                    finish: false,
                                    OperationHistories: [
                                        {
                                            finish: false,
                                            createdAt: new Date()
                                        }
                                    ],
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }
                            ]
                        };
                    } else {
                        return transaction;
                    }
                })) | resolve(true)
                : resolve(false))
        )

    const handleCapture = useCallback((transactionToCapture) => OperationService.captureTransaction(transactionToCapture.id)
        .then((_) => setListTransaction(listTransaction.map(transaction => {
                if (transaction.id === transactionToCapture.id) {
                    return {
                        ...transaction,
                        Operations: [
                            ...transaction.Operations,
                            {
                                price: transaction.amount,
                                quotation: 'Capture de pikachu',
                                status: "capturing",
                                finish: false,
                                OperationHistories: [
                                    {
                                        finish: false,
                                        createdAt: new Date()
                                    }
                                ],
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }
                        ]
                    };
                } else {
                    return transaction;
                }
            }))
        )
    , [listTransaction])

    const handleRefuse = useCallback((transactionToRefuse) => OperationService.refuseTransaction(transactionToRefuse.id)
            .then((_) => setListTransaction(listTransaction.map(transaction => {
                    if (transaction.id === transactionToRefuse.id) {
                        return {
                            ...transaction,
                            Operations: [
                                ...transaction.Operations,
                                {
                                    price: transaction.amount,
                                    quotation: 'Refus de la transaction',
                                    status: "refusing",
                                    finish: false,
                                    OperationHistories: [
                                        {
                                            finish: false,
                                            createdAt: new Date()
                                        }
                                    ],
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }
                            ]
                        };
                    } else {
                        return transaction;
                    }
                }))
            )
        , [listTransaction])

    const canCreateOperation = (transaction, refund = false) => {

        const totalRefundAmount = transaction.Operations.reduce((acc,operation) =>
                ["refunding","partial_refunding"].includes(operation.status) ? acc+operation.price : acc,0);

        if (["captured","refused","creating"].includes(transaction.status) ||
            transaction.Operations.find(operation => !operation.finish) ||
                refund && totalRefundAmount >= transaction.amount) {
            return false;
        }
        return true;
    }

    useEffect(() => user && TransactionService.getTransactions(user.SellerId ?? null).then(data => setListTransaction(data)), [user]);

    return (
        <TransactionContext.Provider
            value={{
                listTransaction,
                handleRefund,
                canCreateOperation,
                handleCapture,
                handleRefuse,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}
