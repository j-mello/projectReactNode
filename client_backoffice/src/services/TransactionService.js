import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/transactions";

export default class TransactionService {
    static getTransactions() {
        const token = JSON.parse(localStorage.getItem("user")).access_token;
        return fetch(apiUrl, {
            headers: {
                'Authorization': "Bearer " + token
            }
        })
            .then(res => FormService.parseServerResponse(res));
    }
}