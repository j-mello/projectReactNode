import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/auth";

class AuthService {
    static login(values) {
        return fetch(apiUrl+'/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody(values)
        }).then(res => FormService.parseServerResponse(res));
    }

    static registerSeller(values) {
        return fetch(apiUrl+'/register-seller', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody(values)
        }).then(res => FormService.parseServerResponse(res));
    }

    static editPassword(values,token) {
        return fetch(apiUrl+"/editPassword", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody({...values, token})
        }).then(res => FormService.parseServerResponse(res));
    }

    static edit(values,token) {
        return fetch(apiUrl+"/edit", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody({...values, token})
        }).then(res => FormService.parseServerResponse(res));
    }
}

export default AuthService;
