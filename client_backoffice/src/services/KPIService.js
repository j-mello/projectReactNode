import request from "./request";
import FormService from "./FormService";

const transactionUrl = "http://"+window.location.hostname+":3001/transactions/kpi";
const operationUrl = "http://"+window.location.hostname+":3001/operations/kpi";

export default class KPIService {
    static getTransactionsKPI(sellerId = null) {
        return request(transactionUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: FormService.generateUrlEncodedBody({sellerId})
        });
    }

    static getOperationKPI(sellerId = null) {
        return request(operationUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: FormService.generateUrlEncodedBody({sellerId})
        });
    }
}