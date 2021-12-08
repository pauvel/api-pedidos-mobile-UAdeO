const express = require('express');
const router = express.Router();
const { makeNewOrder, getDoneOrdersByDate } = require('../../utils/db/orders-crud');

/**
 *      ENDPOINT: /orders
 * 
 */
/**
 *  Crear un nuevo pedido
 */
router.post('/new/order', async(req, res)=>{
    /**
     *  Esta ruta recibe:
     *  Json con los datos del pedido
     *  Json con una lista de objetos(detalles del pedido).
     */
    const { full_order, details_order } = req.body;
    const { cliente_id, importe, fecha, hora, entrega, localizacion, ubicacion, comentario } = full_order;
    await makeNewOrder(
        { cliente_id, importe, fecha, hora, entrega, localizacion, ubicacion, comentario },
        details_order).then( (result)=>{
        if(result){
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    });
});

router.post('/get_done_by_date', async (req, res) => {
    const { from, to } = req.body;
    await getDoneOrdersByDate(from, to)
            .then((r) => {
                return res.json(r);   
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

module.exports = router;
