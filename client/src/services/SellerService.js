const apiUrl = "http://"+window.location.hostname+":3001";

export default class SellerService {
    static getSellers(token) {
        return fetch(apiUrl+'/sellers?token='+token);
    }

    static validSeller(token,sellerId) {
        return fetch(apiUrl+'/sellers/valid/'+sellerId+'/?token='+token, {
            method: "POST"
        }).then(res =>
            res.status !== 200 ?
                res.errors ?
                    {errors: res.errors} :
                    {errors: [res.statusText]} :
                true);
    }
}