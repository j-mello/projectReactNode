import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/auth";

class AuthService {
    static async login(values) {

        let res = await fetch(apiUrl+'/login?'+FormService.generateUrlEncodedBody(values), {
            method: "GET",
        }).then(res => FormService.parseServerResponse(res));

        if (res.success) {
            delete res.success;
            localStorage.setItem("user", JSON.stringify(res));
            window.location.href = "/";
        } else {
            return res;
        }
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

    static logout = async () => {
        if (localStorage.getItem("user") == null) {
            alert("Vous êtes déjà déconnecté!");
            return;
        }
        // Send a disconnect request to the server
        AuthService.deleteSession();
    }

    static deleteSession = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    }
}

export default AuthService;
