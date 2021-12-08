const pool = require('../../../db');

const getAdminData = async(usuario) => {
    const user = await pool.query('SELECT usuario, nombre_real, ultima_conexion FROM administradores WHERE usuario = ?', [usuario]);
    const userData = user[0];
    return {
        username: userData.usuario,
        nombre_real: userData.nombre_real,
        ultima_conexion: userData.ultima_conexion
    };
};

module.exports = {
    getAdminData
}