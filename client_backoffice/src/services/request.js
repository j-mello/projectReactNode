import FormService from "./FormService";

export default function request(url,options = {}) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.access_token : null;

    if (token) {
        options.headers = {
            ...(options.headers || {}),
            'Authorization': "Bearer " + token
        }
    }

    return fetch(url,options).then(res => FormService.parseServerResponse(res));
}