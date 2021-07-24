
const APIpath = "http://"+window.location.hostname+":3001/transactions";

export default class TransactionService {
    
    static createTransaction(cart, sellerId)
    {
        return fetch (APIpath, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: "cart="+encodeURIComponent(JSON.stringify(cart))+"&sellerId="+sellerId
        })
    }
}