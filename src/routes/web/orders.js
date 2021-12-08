const express = require('express');
const router = express.Router();
const { 
    getStatus0Orders, 
    getStatus1Orders, 
    getStatus2Orders, 
    getStatus3Orders, 
    getStatus4Orders, 
    setAproveOrder,
    setReadyOrder,
    setDoneOrder,
    setCancelOrder 
} = require('../../utils/db/orders-crud');


// endpoint = /orders_manage
/*
    getStatus0Orders = on_aprobation 
    getStatus1Orders = aproved 
    getStatus2Orders = ready 
    getStatus3Orders = done
    getStatus4Orders = cancellated
    setAproveOrder   = Aprove
    setReadyOrder    = Ready
    setDoneOrder     = Done
    setCancelOrder   = Cancel

**/

// */orders_manage/show/on_aprobation
router.get('/show/on_aprobation', async (req, res) => {
    await getStatus0Orders()
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

// */orders_manage/show/aproved
router.get('/show/aproved', async (req, res) => {
    await getStatus1Orders()
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

// */orders_manage/show/ready
router.get('/show/ready', async (req, res) => {
    await getStatus2Orders()
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

// */orders_manage/show/done
router.get('/show/done', async (req, res) => {
    await getStatus3Orders()
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

// */orders_manage/show/cancellated
router.get('/show/cancellated', async (req, res) => {
    await getStatus4Orders()
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Aprobar pedido
 */
// */orders_manage/set/aprove
router.put('/set/aprove/', async (req, res) => {
    const { id } = req.body;
    console.log('id :>> ', id);
    await setAproveOrder(id)
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Pedido listo
 */
// */orders_manage/set/ready
router.put('/set/ready', async (req, res) => {
    const { id } = req.body;
    await setReadyOrder(id)
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Pedido entregado
 */
// */orders_manage/set/done
router.put('/set/done', async (req, res) => {
    const { id } = req.body;
    await setDoneOrder(id)
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Cancelar pedido
 */
// */orders_manage/set/cancel
router.put('/set/cancel', async (req, res) => {
    const { id } = req.body;
    await setCancelOrder(id)
            .then( ( r ) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});



module.exports = router;

