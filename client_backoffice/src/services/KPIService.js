import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/kpi";

export default class SellerService {
    static getTransactions(token) {
        return fetch(apiUrl+'?token='+token)
            .then(res => FormService.parseServerResponse(res));
    }

    static getOperations(token,sellerId) {
        return fetch(apiUrl+'/'+sellerId+'/active/?token='+token, {
            method: "POST"
        }).then(res => FormService.parseServerResponse(res));
    }
}