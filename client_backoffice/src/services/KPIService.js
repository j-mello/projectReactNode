import FormService from "./FormService";

const transactionUrl = "http://"+window.location.hostname+":3001/transactions/kpi";
const operationUrl = "http://"+window.location.hostname+":3001/operations/kpi";

export default class KPIService {
    static getTransactionsKPI(sellerId = null) {
        const token = JSON.parse(localStorage.getItem("user")).access_token;
        return fetch(transactionUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': "Bearer " + token
            },
            body: FormService.generateUrlEncodedBody({sellerId})
        })
            .then(res => FormService.parseServerResponse(res));
    }

    static getOperationKPI(sellerId = null) {
        const token = JSON.parse(localStorage.getItem("user")).access_token;
        return fetch(operationUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': "Bearer " + token
            },
            body: FormService.generateUrlEncodedBody({sellerId})
        })
            .then(res => FormService.parseServerResponse(res));
    }
}