import FormService from "./FormService";

const apiUrl = "http://"+window.location.hostname+":3001/auth";

class AuthService {
    static async login(values) {

        let res = await fetch(apiUrl+'/login?'+FormService.generateUrlEncodedBody(values), {
            method: "GET",
        }).then(res => res.status !== 200 ? {errors: [res.statusText]} : res.json());

        if (res.access_token) {
            localStorage.setItem("user", JSON.stringify(res));
            window.location.href = "/";
        } else {
            return res;
        }
    }

    static async registerSeller(values) {

        let res = await fetch(apiUrl+'/register-seller', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody(values)
        }).then(res => res.status !== 200 ? res.json() : 200);
        if (res === 200) {
            return {success: true}
        } else {
            return res;
        }
    }

    static edit(values,token) {
        return fetch(apiUrl+"/edit", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: FormService.generateUrlEncodedBody({...values, token})
        }).then(res => res.status !== 200 ? {errors: [res.statusText]} : {success: true});
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
