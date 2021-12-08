const pool = require('../../dbshop');

// NOTA: Para obtener los ingredientes que pertenecen a un producto
// Revisar: platillos-crud.

/**
 * CREAR NUEVO INGREDIENTE EN EL SISTEMA.
 *  @param { Nombre del ingrediente a crear } nombre 
 * 
 */
const createIngredient = ( nombre ) => {
    return new Promise( async (resolve, reject) => {
        const result = await pool.query('INSERT INTO ingredientes (nombre) VALUES (?);', [nombre]);
        resolve({
            ingredient: result
        });
    });
}

/**
 * 
 * OBTENER TODOS LOS INGREDIENTES.
 */
const getAllIngredients = () => {
    return new Promise( async (resolve, reject) => {
        const result = await pool.query('SELECT * FROM ingredientes');
        resolve({
            ingredients: result
        });
    });
}

/**
 * Obtener ingrediente por su ID.
 * @param {Id del ingrediente} id 
 * 
 */
const getIngredientById = ( id ) => {
    return new Promise( async (resolve, reject) => {
        const query = `SELECT * FROM ingredientes WHERE id = ?`;
        const result = await pool.query(query, [id]);
        resolve({
            ingredient: result[0]
        });
    });
}

/**
 *  ELIMINAR INGREDIENTE POR SU ID.
 * @param { Identificador del ingrediente } id 
 */
const deleteIngredient = ( id ) => {
    return new Promise( async (resolve, reject) => {
        // TODO: Configurar cascada para ingredientes_con_productos.
        const result = await pool.query('DELETE FROM ingredientes WHERE id = ?', [id]);
        resolve({
            deleted_ingredient: result
        });
    });
}

/**
 *      ACTUALIZAR INGREDIENTE POR SU ID.
 * @param { Identificador del ingrediente } id 
 * @param { Nuevo nombre del ingrediente } name 
 */
const updateIngredient = ( id, name ) => {
    return new Promise( async (resolve, reject) => {
        const result = await pool.query('UPDATE ingredientes SET nombre = ? WHERE id = ?', [name, id]);
        resolve({
            ingredient: result
        });
    });
}

/**
 * Agregar un ingrediente a un producto.
 * 
 * @param { Identificador del producto } product 
 * @param { Identificador del ingrediente } ingredient 
 */
const createIngredientForProduct = ( product, ingredient ) => {
    return new Promise( async (resolve, reject) => {
        const result = await pool.query('INSERT INTO platillos_con_ingredientes(platillo_id, ingrediente_id) VALUES(?,?)', [product, ingredient]);
        resolve({
            result
        });
    });
}

/**
 * Quitar un ingrediente a un producto.
 * 
 * @param { product } Identificador del producto 
 * @param { ingredient }  Identificador del Ingrediente
 */
const deleteIngredientForProduct = ( product, ingredient ) => {
    return new Promise( async (resolve, reject) => {
        const result = await pool.query('DELETE FROM platillos_con_ingredientes WHERE platillo_id = ? AND ingrediente_id = ?', [product, ingredient]);
        resolve({
            result
        });
    });
}



module.exports = {
    getAllIngredients,
    getIngredientById,
    createIngredient,
    deleteIngredient,
    updateIngredient,
    createIngredientForProduct,
    deleteIngredientForProduct
}