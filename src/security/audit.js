const { log, logLogin } = require('../utils/db/create-log');

/// Auditar una accion.
const audit          = async( data )    =>  await log( data );
/// Cambiar ultima conexion del usuario.
const lastlogin      = async( usuario ) =>  await logLogin(usuario);


module.exports = {
    audit,
    lastlogin
};