import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/sellers";

export default class SellerService {
    static getSellers() {
        return fetch(apiUrl)
            .then(res => FormService.parseServerResponse(res));
    }

    static validSeller(token,sellerId) {
        return fetch(apiUrl+'/'+sellerId+'/active/?token='+token, {
            method: "POST"
        }).then(res => FormService.parseServerResponse(res));
    }
}
