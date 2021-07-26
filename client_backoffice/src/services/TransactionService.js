import request from "./request";

const apiUrl = "http://"+window.location.hostname+":3001/transactions";

export default class TransactionService {
    static getTransactions(sellerId = null) {
        return request(apiUrl + (sellerId ? '/?sellerId=' + sellerId : ''));
    }
}