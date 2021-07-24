import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/transactions";

export default class TransactionService {
    static getTransactions(token, sellerId = null) {
        return fetch(apiUrl + (sellerId ? '/?sellerId=' + sellerId : ''), {
            headers: {
                'Authorization': "Bearer " + token
            }
        })
            .then(res => FormService.parseServerResponse(res));
    }
}