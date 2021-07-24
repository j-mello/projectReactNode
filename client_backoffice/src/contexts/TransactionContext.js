import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import TransactionService from "../services/TransactionService";

export const TransactionContext = createContext([]);

export default function TransactionProvider({ children, user }) {
    const [listTransaction, setListTransaction] = useState([]);

    useEffect(() => user && TransactionService.getTransactions(user.access_token, user.SellerId ?? null).then(data => setListTransaction(data)), [user]);

    return (
        <TransactionContext.Provider
            value={{
                listTransaction,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}
