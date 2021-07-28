import request from "./request";
import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/operations";

export default class OperationService {
    static refundItem(transactionId, amountToRefund) {
        return request(apiUrl + '/refund/' + transactionId, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            'body': FormService.generateUrlEncodedBody({ 'amount': amountToRefund })
        });
    }

    static captureTransaction(transactionId) {
        return request( apiUrl + '/capture/' + transactionId, {
            'method': 'POST'
        })
    }

    static refuseTransaction(transactionId) {
        return request( apiUrl + '/refuse/' + transactionId, {
            'method': 'POST'
        })
    }
}