const mysql = require('mysql'); // Requerimos el modulo mysql.
const { promisify } = require('util'); // Requerimos promisify para convertir callbacks a promesas.
const { database } = require('./keys'); // Traemos el objeto database de los exports de keys.

const pool = mysql.createPool(database); // Creamos un pool y lo guardamos en [pool].

// Hacemos el getConnection al pool el cual nos retorna err & connection.
// Dentro del callback evaluamos si llego err o llego connection.
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Conexion con la base de datos fue cerrada.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Error: demasiadas conexiones activas.')
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Conexion rechazada.')
        }
    }
    if (connection) connection.release();
    console.log(`Base de datos 'system' conectada.`);
});

// promisify pool querys.
pool.query = promisify(pool.query);

// Exportamos el objeto pool.
module.exports = pool;