import request from "./request";

const apiUrl = "http://"+window.location.hostname+":3001/credentials";

export default class CredentialService {
    static getCredentials() {
        return request(apiUrl);
    }

    static generateCredential() {
        return request(apiUrl, {
            method: 'POST'
        });
    }

    static regenerateCredential(id) {
        return request(apiUrl+"/"+id, {
            method: 'PUT'
        });
    }

    static removeCredential(id) {
        return request(apiUrl+"/"+id, {
            method: 'DELETE'
        });
    }
}