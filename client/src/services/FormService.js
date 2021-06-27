import React from 'react';

class FormService {
    static displayErrors(errorList) {
        if (errorList.length === 0) return "";
        return <ul>
            {errorList.map(error =>
                <li key={error} style={{color: "red"}}>{error}</li>
            )}
        </ul>
    }

    static generateUrlEncodedBody(values) {
        let formBody = [];
        for (const attr in values) {
            if (values[attr]) {
                formBody.push(encodeURIComponent(attr) + "=" + encodeURIComponent(values[attr]));
            }
        }
        return formBody.join("&");
    }

    static generateFormData(values) {
        let formData = new FormData();
        for (const attr in values) {
            formData.append(attr,values[attr]);
        }
        return formData;
    }

    static async parseServerResponse(res) {
        let json = null;
        try {
            json = await res.json();
        } catch (e){}
        if (res.status === 200) {
            return {...json, success: true};
        }
        if (json && json.errors) {
            return json;
        }
        return {errors: [res.statusText]}
    }


}

export default FormService;
