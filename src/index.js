const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

// Settings
app.set('port', process.env.PORT || 4000); // Port.

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global variables
app.use((req, res, next) => {
    next();
});

// Routes
app.use('/client/make',   require('./routes/mobile/client'));
app.use('/orders',        require('./routes/mobile/orders'));
app.use('/orders_manage', require('./routes/web/orders'));
app.use('/admin/make',    require('./routes/web/admin'));
app.use('/shop/make',     require('./routes/web/shop'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
});