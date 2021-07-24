import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

export const ListContext = createContext([]);

export default function ListProvider({ children }) {
    const [list, setList] = useState([]);

    /*const deleteItem = useCallback(
        (item) => setList(list.filter((it) => it !== item)),
        [list]
    );
    const editItem = useCallback(
        (item) => setList(list.map((it) => (it.id === item.id ? item : it))),
        [list]
    );
    const addItem = useCallback((item) => setList([...list, item]), [list]);

    const getItem = useCallback((id) => list.find((it) => it.id === id), [list]);
    */
    return (
        <ListContext.Provider
            value={{
                list,
                setList
            }}
        >
            {children}
        </ListContext.Provider>
    );
}
