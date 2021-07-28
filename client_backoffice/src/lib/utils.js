export function parseDate(str) {
    const date = new Date(str);
    return addMissingZero(date.getDate()) + '/' + addMissingZero(date.getMonth() + 1) + '/' +
        addMissingZero(date.getFullYear()) + ' ' + addMissingZero(date.getHours()) + ':' +
            addMissingZero(date.getMinutes()) + ':' + addMissingZero(date.getSeconds());
}


const addMissingZero = (number, n = 2) => {
    if (typeof number === "number") {
        number = number.toString();
    }
    while(number.length < n) {
        number = '0' + number;
    }
    return number;
}

export const isNumber = (str) => typeof str === "number" || (typeof str === "string" && parseFloat(str).toString() === str && str !== "NaN")