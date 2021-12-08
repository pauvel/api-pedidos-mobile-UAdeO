const pool = require('../../db');

const log = ({ usuario, accion, satisfactorio, ip}) => {
    const logData = {
        usuario,
        accion,
        satisfactorio,
        ip
    };
    pool.query('INSERT INTO log set ?', [logData]);
}

const logLogin = async(  usuario  ) => await pool.query('UPDATE administradores SET ultima_conexion = NOW() WHERE usuario = ?', [usuario]);

module.exports = {
    log,
    logLogin
}