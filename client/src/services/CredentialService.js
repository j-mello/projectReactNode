import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/credentials";

export default class CredentialService {
    static getCredentials(token) {
        return fetch(apiUrl+"?token="+token)
            .then(res => FormService.parseServerResponse(res))
    }

    static generateCredential(token) {
        return fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody({token})
        }).then(res => FormService.parseServerResponse(res));
    }

    static regenerateCredential(token,id) {
        return fetch(apiUrl+"/"+id,{
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody({token})
        }).then(res => FormService.parseServerResponse(res));
    }

    static removeCredential(token,id) {
        return fetch(apiUrl+"/"+id, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody({token})
        }).then(res => FormService.parseServerResponse(res));
    }
}