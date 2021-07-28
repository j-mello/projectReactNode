export default class SessionService {
    static login(values) {
        return fetch( 'http://'+window.location.hostname+':3001/auth/login-oauth2', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: Object.keys(values).map(key => key+"="+encodeURIComponent(values[key])).join("&")+"&grant_type="+encodeURIComponent("client_credentials")
        });
    }

    static logout(token) {
        return fetch('http://'+window.location.hostname+':3001/auth/logout-oauth2?token='+token, {
            method: "POST"
        });
    }
}