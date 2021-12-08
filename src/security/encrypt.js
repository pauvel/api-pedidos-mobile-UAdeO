const stringHexEncrypt = require('string-hex');

/// 1: Este metodo obtiene la password la convierte a mayusculas.
/// 2: Toma cada letra y/o numero y lo convierte a HEX. para posteriormente multiplicar
///    cada caracter por la length de la password.
/// 3: Una vez hecho eso, se convertira cada resultado de la multiplicacion a HEX nuevamente
///    formando asi una cadena de caracteres con una longitud maxima de 32 y un (*) en su primer index.
const passwordEncrypt = (pass = "") => {
    let password = pass.toUpperCase().split(''); // 1.
    let mappedPassword = password.map((value) => {
        let decimalValue = stringHexEncrypt(value) * pass.length; // 2.
        return stringHexEncrypt(`${decimalValue}`); // 3.
    });
    mappedPassword.unshift('*');
    password = mappedPassword.join(''); // Cadena generada.
    return (password.length > 32) ? password.split('').slice(0, 32).join('') : password; // Si pasa de 32 caracteres se reduce a 32.
}

module.exports = {
    passwordEncrypt
}