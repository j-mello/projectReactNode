import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001";

export default class SellerService {
    static getSellers(token) {
        return fetch(apiUrl+'/sellers?token='+token);
    }

    static validSeller(token,sellerId) {
        return fetch(apiUrl+'/sellers/'+sellerId+'/active/?token='+token, {
            method: "POST"
        }).then(res => FormService.parseServerResponse(res));
    }
}
