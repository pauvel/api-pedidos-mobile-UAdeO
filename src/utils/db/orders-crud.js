const pool = require('../../dbshop');

/**
 * 
 *  **********
 *  - Mostrar pedidos por aprobar
 *  - Mostrar pedidos en curso
 *  - Mostrar pedidos terminados
 *  - Crear nueva orden
 *  
 * *******************
 */

 /** 
  *  Crear nuevo @pedido con sus respectivos @detalles .
  */
 const makeNewOrder = (order = {}, detailsOrder = []) => {
     /**
      *  Recibimos el @pedido y sus detalles, secuencia:
      *     - Insertamos el pedido.
      *     - Si se inserta sacamos el id del pedido introducido.
      *     - Mapeamos los detalles y cada objeto que venga dentro
      *       le asignamos el @pedido_id y lo insertamos a la db.
      */
    return new Promise( async(resolve, reject) => {
        await pool.query('INSERT INTO pedidos SET ?', 
                [order],
                async(err, res)=>{
                    if(err) throw err;
                    if(res.affectedRows > 0){
                        const { insertId } = await res;
                        await detailsOrder.map( async(value, index, arr) => {
                            value.pedido_id = insertId;
                                await pool.query('INSERT INTO pedidos_detalles SET ?', 
                                [value]
                            );
                        });
                        const orderDate = `${order.fecha} ${order.hora}`;
                        await pool.query('UPDATE clientes SET cantcompras = cantcompras+1 WHERE id = ?', [order.cliente_id]);
                        await pool.query('UPDATE clientes SET ult_visita = ? WHERE id =?', [orderDate, order.cliente_id]);
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                }
        );
    }).catch(err => console.log('err :>> ', err));
 }

 const getStatus0Orders = () => {
     return new Promise( async (resolve, reject) => {
        const res = await pool.query(`
        SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
        FROM pedidos 
        pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.estatus = 0`.trim()
        );
        resolve({
            orders: res
        });
     });
 }

const getStatus1Orders = () => {
    return new Promise( async (resolve, reject) => {
        const res = await pool.query(`
        SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
        FROM pedidos 
        pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.estatus = 1`.trim()
        );
       resolve({
           orders: res
       });
    });
}

const getStatus2Orders = () => {
    return new Promise( async (resolve, reject) => {
        const res = await pool.query(`
        SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
        FROM pedidos 
        pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.estatus = 2`.trim()
        );
       resolve({
           orders: res
       });
    });
}

const getStatus3Orders = () => {
    return new Promise( async (resolve, reject) => {
        const res = await pool.query(`
        SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
        FROM pedidos 
        pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.estatus = 3`.trim()
        );
       resolve({
           orders: res
       });
    });
}

const getStatus4Orders = () => {
    return new Promise( async (resolve, reject) => {
        const res = await pool.query(`
        SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
        FROM pedidos 
        pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.estatus = 4`.trim()
        );
       resolve({
           orders: res
       });
    });
}

const setAproveOrder = ( order ) => {
    return new Promise( async (resolve, reject) => {
        const response = await pool.query(`UPDATE pedidos SET estatus = 1 WHERE id = ?`, [order]);
        return resolve(response);
    });
};

const setReadyOrder = ( order ) => {
    return new Promise( async (resolve, reject) => {
        const response = await pool.query(`UPDATE pedidos SET estatus = 2 WHERE id = ?`, [order]);
        return resolve(response);
    });
};

const setDoneOrder = ( order ) => {
    return new Promise( async (resolve, reject) => {
        const response = await pool.query(`UPDATE pedidos SET estatus = 3 WHERE id = ?`, [order]);
        return resolve(response);
    });
};

const setCancelOrder = ( order ) => {
    return new Promise( async (resolve, reject) => {
        const response = await pool.query(`UPDATE pedidos SET estatus = 4 WHERE id = ?`, [order]);
        return resolve(response);
    });
};

const getDoneOrdersByDate = ( from, to ) => {
    return new Promise( async (resolve, reject) => {
        const res = await pool.query(`
            SELECT pd.id, cl.id AS telefono, cl.nombrecompleto AS cliente, pd.importe, pd.fecha, pd.hora, pd.entrega, pd.localizacion, pd.ubicacion, pd.comentario, pd.estatus 
            FROM pedidos 
            pd JOIN clientes cl ON pd.cliente_id = cl.id WHERE pd.estatus = 3 AND pd.fecha BETWEEN ? AND ?`.trim(),
            [from, to]
        );
        return resolve({
            orders: res
        });
    });
};


 module.exports = {
    makeNewOrder,
    getStatus0Orders,
    getStatus1Orders,
    getStatus2Orders,
    getStatus3Orders,
    getStatus4Orders,
    setAproveOrder,
    setReadyOrder,
    setDoneOrder,
    setCancelOrder,
    getDoneOrdersByDate
 }