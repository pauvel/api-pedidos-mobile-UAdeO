const pool = require('../../../db');
const { passwordEncrypt } = require('../../../security/encrypt');

/// [validateLogin] validara un usuario y una password si estos dos
/// existen dentro de la tabla 'administradores' en la base de datos 'system'
/// entonces devolvera TRUE.
const validateLogin = (username = "", password = "") => {
    return new Promise((resolve, reject) => {
        const userData = {
            usuario: username,
            password: passwordEncrypt(password)
        };
        pool.query(`SELECT idadmin FROM administradores WHERE usuario = '${userData.usuario}' AND password = '${userData.password}'`, (err, results) => {
            if (results != '') {
                resolve(true);
            } else {
                resolve(false);
            }
        }, (err) => {
            reject(err);
        });
    });
};

const validateUsername = (username = "") => {
    return new Promise((resolve, reject) => {
        const userData = {
            usuario: username,
        };
        pool.query(`SELECT idadmin FROM administradores WHERE usuario = '${userData.usuario}'`, (err, results) => {
            if (results != '') {
                resolve(results[0].idadmin);
            } else {
                reject(false);
            }
        });
    });
};

module.exports = {
    validateLogin,
    validateUsername
};