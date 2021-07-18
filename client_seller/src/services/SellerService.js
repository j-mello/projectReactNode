const apiUrl = "http://"+window.location.hostname+":3001/sellers";

export default class SellerService {
    static getSellers() {
        return fetch(apiUrl)
            .then(res => res.json());
    }
}