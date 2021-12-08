const express = require('express');
const router = express.Router();
const { validateLogin } = require('../../utils/querys/mobile/validate-client-login');
const { createClient, 
        updateClient, 
        showClient,
        getAllClients 
} = require('../../utils/db/client-crud');
const { getOrdersOfClient, 
        getOrdersDetailsOfClient, 
        getClientOrderStatus 
} = require('../../utils/querys/mobile/get-client-orders');


/**
 *  Crea un nuevo @cliente en el sistema
 */
router.post('/new', async(req, res) => {
    const { telefono, nombrecompleto, localidad, direccion, password } = req.body;
    await createClient(telefono, nombrecompleto, localidad, direccion, password) // Metodo para insertar nuevo cliente.
        .then(isCreated => (isCreated) ?
            res.sendStatus(200) 
            : 
            res.sendStatus(404)
        );
});

/**
 *  Actualiza los datos de un @cliente en el sistema.
 */
router.post('/update', async(req, res) => {
    const { telefono, nombrecompleto, localidad, direccion, password } = req.body;
    // TODO: RE HACER PETICION.
    await updateClient(telefono, nombrecompleto, localidad, direccion, password)
        .then(isUpdated => (isUpdated) ?
            res.json({
                response: {
                    updated: true
                }
            }) : res.json({
                response: {
                    updated: false
                }
            }));
});

/**
 *  Valida @phone & @password de un @cliente
 */
router.post('/validate', async(req, res) => {
    let { phone, password } = req.body;
    await validateLogin(phone, password).then( (userIsOk) => {
        if (userIsOk) {
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    }).catch((err) => {
        console.log(`Rejected from client auth validate ${err}`);
    });
});

/**
 *  Obtener datos completos del @cliente
 */
router.get('/show/:user', async(req, res)=>{
    const { user } = req.params;
    await showClient(user).then((data) => {
        if(data){
            res.json({
                response:{
                    data
                }
            });
        }
    });
});

/**
 *  Obtener todos los clientes
 */
router.get('/all', async(req, res)=>{
    await getAllClients().then((data) => {
        return res.json(data);
    });
});

/**
 *  Obtener pedidos hechos por el @cliente
 */
router.get('/show/orders/:user', async(req, res)=>{
    const { user } = req.params;
    await getOrdersOfClient(user)
            .then(r => {
                if(r){
                    res.json(r);
                }else{
                    res.sendStatus(404);
                }
            });
});

/**
 *  Obtener detalles de un pedido hecho por el @cliente, recibe: @user = cliente  @order = pedido.
 *  R: Todos los detalles & productos. order & order products.
 */
router.get('/show/order_details/:user/:order', async(req, res)=>{
    const { user, order } = req.params;
    await getOrdersDetailsOfClient(user, order)
            .then(r => {
                if(r){
                    res.json(r);
                }else{
                    res.sendStatus(404);
                }
            });
});

/***
 *  Obtener el estado de un pedido. recibe: @cliente & @order .
 * 
 */
router.get('/show/order_status/:user/:order', async (req, res) => {
    const {user, order} = req.params;
    await getClientOrderStatus(user, order)
            .then((result) => {
                if(result == null) return res.sendStatus(404);
                return res.json(result);
            }).catch((err) => {
                return res.sendStatus(500);
            });;
});
module.exports = router;