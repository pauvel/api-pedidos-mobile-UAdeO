const pool = require('../../dbshop');

/**
 *  Obtiene todos los productos de la db.
 */
const showProducts = ( category ) => new Promise( async(resolve, reject) =>{
    const selectProductQuery = `
        SELECT t1.id, 
                t1.nombre, 
                t1.descripcion, 
                t1.precioch, 
                t1.preciog,
                t1.unitario, 
                t1.url, 
                t2.nombre AS 'categoria' 
                FROM platillos t1 
                JOIN platillos_categorias t2 ON t1.categoria_id = t2.id
                WHERE t1.estatus = 0 AND t2.estatus = 0 AND
                t2.nombre = ?
                ORDER BY t1.id DESC
    `;
    const products = await pool.query(selectProductQuery.trim(), [category]);
    resolve(products);
});

/**
 * 
 * Obtiene todos los productos acorde su categoria 
 */
const showProductByCategory = ( category ) => {
    return new Promise(async(resolve, reject)=>{
        const query = `
            SELECT  pl.id, 
                    pl.nombre, 
                    pl.descripcion, 
                    pl.precioch, 
                    pl.preciog, 
                    pl.unitario, 
                    pl.url, 
                    pl.categoria_id,
                    pl.likes
            FROM platillos pl
            WHERE pl.categoria_id = ?
        `.trim();
        const products = await pool.query(query, [category]);
        if(products != ''){
            resolve({
                products
            });
        }else{
            resolve(false);
        }
    });
};


/**
 *  OBTENER INGREDIENTES QUE CONTIENE UN PRODUCTO.
 * @param { Identificador del producto} id 
 */
const getProductDetails = ( id ) => {
    return new Promise( async (resolve, reject) => {
        const query = `
            SELECT  ing.id, 
                    ing.nombre, 
                    ing.estatus 
            FROM 
                    platillos_con_ingredientes pci 
            JOIN 
                    ingredientes ing ON pci.ingrediente_id = ing.id 
            WHERE pci.platillo_id = ?
        `.trim();
        const res = await pool.query(query, [id]);
        resolve({
            ingredients: res
        });
    });
}

/**
 *      OBTENER PRODUCTO POR SU ID.
 * @param { identificador del producto} id 
 */
const getProductById = ( id ) => {
    return new Promise( async (resolve, reject) => {
        const query = `SELECT * FROM platillos WHERE id = ?`;
        const result = await pool.query(query, [id]);
        resolve({
            product: result[0]
        });
    });
}

/**
 * Obtener ingrediente por su id
 * TODO: Dejar de usar este y utilizar el de ingredients-crud.
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
 *  Crea un nuevo producto.
 */
const createProduct = ({ nombre, descripcion, precioch, preciog, unitario, url, categoria }) => {
    const setData = {
        nombre,
        descripcion,
        precioch,
        preciog,
        unitario,
        url,
        categoria_id: categoria
    };

    console.log(setData);

    return new Promise( async(resolve, reject) => {
        await pool.query('INSERT INTO platillos SET ?', 
                        [setData],
                            (err, res) => (res) ? resolve(true) : resolve(false)
        );
    });
};

/**
 *  Actualiza un producto.
 * @param {Identificador del producto} id 
 * @param {Nombre del producto} nombre 
 * @param {Descripcion del producto} descripcion 
 * @param {Precio chico} precioch 
 * @param {Precio grande} preciog 
 * @param {es unitario?} unitario 
 * @param {Url de la imagen} url 
 */
const updateProduct = ( id, nombre, descripcion, precioch, preciog, unitario, url, categoria ) => {
    return new Promise( async ( resolve, reject ) => {
        const productInfo = {
            nombre,
            descripcion,
            precioch,
            preciog,
            unitario,
            url,
            categoria_id: categoria
        }
        const res = await pool.query('UPDATE platillos SET ? WHERE id = ?', [productInfo, id]);
        resolve(res);
    });
};

const deleteProduct = ( product ) => {
    return new Promise( async (resolve, reject) => {
        const result =  await pool.query('DELETE FROM platillos WHERE id = ?', [product]);
        resolve(result);
    });
};

module.exports = {
    createProduct,
    showProducts,
    showProductByCategory,
    getProductDetails,
    getProductById,
    getIngredientById,
    updateProduct,
    deleteProduct
}