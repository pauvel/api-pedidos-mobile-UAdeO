const pool = require('../../../dbshop');
const pooldb = require('../../../dbshop');

const getOrdersOfClient = (id) =>{
    return new Promise(async(resolve, reject)=>{
        const getTotalOrdersOfClient = 'SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY id DESC LIMIT 15';
        const orders = await pooldb.query(getTotalOrdersOfClient, [id]);

        if(orders != ''){
            resolve({
                orders
            });
        }else{
            resolve(false);
        }
    });
};

const getOrdersDetailsOfClient = (client, order) => {
    return new Promise( async (resolve, reject) => {
        const getTotalOrderDetailsOfClient = `
            SELECT pl.nombre, pdd.precio, pdd.cantidad, pdd.importe, pdd.ingredientes, pl.url
            FROM pedidos_detalles pdd 
            INNER JOIN platillos pl ON pl.id = pdd.platillo_id 
            INNER JOIN pedidos pd ON pdd.pedido_id = pd.id 
            WHERE pdd.pedido_id = ? AND pd.cliente_id = ?
        `.trim();
        const getOrderData = `
            SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
            FROM pedidos 
            pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.id = ?
        `.trim();
        let orderDetails = await pooldb.query(getTotalOrderDetailsOfClient, [order, client]);
        let orderData = await pooldb.query(getOrderData, [order]);
        if(orderDetails != ''){
            resolve({
                order: orderData[0],
                order_products: orderDetails
            });
        }else{
            resolve(false);
        }
    });
};

const getClientOrderStatus = ( client, order ) => {
    return new Promise( async (resolve, reject) => {
        const query = `SELECT estatus FROM pedidos WHERE cliente_id = ? AND id = ?;`;
        const orderState = await pool.query(query, [client, order])
        if(orderState != null && orderState != ''){
            const status = orderState[0].estatus;
            switch (status) {
                case 0:
                    resolve({
                        estatus_id: 0,
                        estatus: "En aprobación.",
                        estatus_description: `Su pedido se encuentra en estado de aprobacion, espere a que sea aprobado por nosotros para proceder a ser elaborado.`
                    });
                    break;
                case 1:
                    resolve({
                        estatus_id: 1,
                        estatus: "Aprobado, se está cocinando.",
                        estatus_description: `Su pedido se encuentra en estado de aprobacion, espere a que este sea aprobado por nosotros para proceder a ser elaborado.`
                    });
                    break;
                case 2:
                    resolve({
                        estatus_id: 2,
                        estatus: "Su pedido está listo.",
                        estatus_description: `Su pedido esta listo, ya puede pasar a recogerlo ó si lo pidío a domicilio espere al repartidor este llegará pronto.`
                    });
                    break;
                case 3:
                    resolve({
                        estatus_id: 3,
                        estatus: "Entregado.",
                        estatus_description: `Este pedido fue elaborado y entregado con exito.`
                    });
                    break;
                case 4:
                    resolve({
                        estatus_id: 4,
                        estatus: "Cancelado",
                        estatus_description: `Su pedido fue cancelado, comuniquese con nosotros en breve para recibir informacion sobre el estado de su pedido.`
                    });
                    break;
                default:
                    resolve(null);
                    break;
            }
        }else{
            resolve(null);
        }
    });
};

module.exports = {
    getOrdersOfClient,
    getOrdersDetailsOfClient,
    getClientOrderStatus
}