import request from "./request";

const apiUrl = "http://"+window.location.hostname+":3001/sellers";

export default class SellerService {
    static getSellers() {
        return request(apiUrl);
    }

    static validSeller(sellerId) {
        return request(apiUrl+'/'+sellerId+'/active', {
            method: 'POST'
        });
    }
}
