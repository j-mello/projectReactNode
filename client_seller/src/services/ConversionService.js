const apiPath = 'http://'+window.location.hostname+':3001/conversionRate';

export default class ConversionService {
    static getConversionRate(){
        return fetch (apiPath)
        .then(res => res.json());
    }
}