const pool = require(`../../db`);
const { passwordEncrypt } = require('../../security/encrypt');


/// [createUser] es una promesa que inserta un nuevo administrador ala base de datos
/// Si la consulta es correcta devolvera TRUE.
const createUser = (usuario = '', password = '', nombrereal = '') => {
    const newUser = {
        usuario,
        password: passwordEncrypt(password),
        nombre_real: nombrereal
    };
    return new Promise( async(resolve, reject)=> {
        await pool.query('INSERT INTO administradores set ?', [newUser], 
        (err, res) => (res) ? resolve(true) : resolve(false))
    });
};

module.exports = { createUser };