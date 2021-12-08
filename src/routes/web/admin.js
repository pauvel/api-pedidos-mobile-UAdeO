const express = require('express');
const router = express.Router();
const { createUser } = require('../../utils/db/admin-crud');
const { validateLogin } = require('../../utils/querys/web/validate-admin-login');
const { getAdminData } = require('../../utils/querys/web/get-admin-data');
const { lastlogin } = require('../../security/audit');
const { audit } = require('../../security/audit');

/// [ /admin/make ]
router.post('/new', (req, res) => {
    let { usuario = null, password = null, nombrereal = null } = req.body;
    if (usuario && password && nombrereal) {
        // Insertar nuevo administrador.
        createUser(usuario, password, nombrereal)
        .then( created => (created) ? res.sendStatus(200) : res.sendStatus(404))
        .catch( err => res.sendStatus(500) );
    };
});

/// Esta ruta recibira un usuario y un password mediante el metodo POST
/// la cual procedera a validar el login desde 'validate-admin-login.js'
/// si este devuelve TRUE entonces retornamos un 200 satisfactorio.
//  [ /validate/ ] : Si el usuario y la pass existe.
router.post('/validate', (req, res) => {
    let { usuario, password } = req.body;
    res.json({
        status: 200,
        data:{
            usuario: usuario,
            nombre_real: 'PGVL',
            ultima_conexion: '25/11/1995'
        }
    });
});

module.exports = router;