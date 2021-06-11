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
}

export default FormService;
