const pooldb = require('../../../dbshop');
const { passwordEncrypt } = require('../../../security/encrypt');

/// [validateLogin] validara un usuario y una password si estos dos
/// existen dentro de la tabla 'clientes' en la base de datos 'dbmobile'
/// entonces devolvera TRUE.
const validateLogin = (username = "", password = "") => {
    return new Promise((resolve, reject) => {
        const userData = {
            usuario: username,
            password: passwordEncrypt(password)
        };
        pooldb.query(`SELECT cantcompras FROM clientes WHERE id = '${userData.usuario}' AND password = '${userData.password}'`, (err, results) => {
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

module.exports = {
    validateLogin
};