const apiUrl = "http://"+window.location.hostname+":3001";

class AuthService {
    static async login(email,password) {
        const args = "email="+email+"&password="+password;

        let res = await fetch(apiUrl+'/login?'+args, {
            method: "GET",
        }).then(res => res.statusText === "Unauthorized" ? {errors: ["Unauthorized"]} : res.json());

        if (res.access_token) {
            localStorage.setItem("user", JSON.stringify(res));
            window.location.href = "/";
        } else {
            return res;
        }
    }

    static async register(name,email,password,password_confirmation) {
        let formData = new FormData();
        formData.append("name",name);
        formData.append("email",email);
        formData.append("password", password);
        formData.append("password_confirmation", password_confirmation);

        let res = await fetch(apiUrl+'/api/auth/register', {
            method: "POST",
            body: formData
        }).then(res => res.json());
        if (typeof(res) === "string") {
            res = JSON.parse(res);
        }
        if (res.user) {
            this.login(email,password);
        } else {
            return res;
        }
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