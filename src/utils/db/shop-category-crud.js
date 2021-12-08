const pool = require('../../dbshop');


const showLastCategory = () => new Promise( async(resolve, reject) =>{
    const category = await pool.query('SELECT nombre FROM platillos_categorias ORDER BY id DESC LIMIT 1');
    resolve(category[0]); 
});

const showCategories = () => new Promise( async(resolve, reject) =>{
    const categories = await pool.query('SELECT id, nombre FROM platillos_categorias WHERE estatus = 0 ORDER BY id DESC');
    resolve(categories);
});

const createNewCategory = ( categoryName ) => new Promise( async(resolve, reject) => {
    await pool.query('INSERT INTO platillos_categorias (nombre) VALUES (?)', 
        [categoryName],
            (err, res) => (res) ? resolve(true) : resolve(false)
    );
});

const updateCategory = ( idCategory, newCategoryName ) => new Promise( async(resolve, reject) => {
    /**
     *  Metodo para actualizar una categoria.
     */
    await pool.query('UPDATE platillos_categorias SET nombre = ? WHERE id = ?', 
        [newCategoryName, idCategory],
            (err, res) => {
                if(err){
                    throw err;
                }else{
                    if(res.changedRows == 0)    resolve(false);
                    if(res.changedRows >  0)    resolve(true);
                }
            }
    );
});

const deleteCategory = ( idCategory ) => new Promise( async(resolve, reject) => {
    /**
     *  Eliminar una categoria.
     */
    await pool.query('DELETE FROM platillos_categorias WHERE id = ?', 
        [idCategory],
            (err, res) => {
                if(err){
                    throw err;
                }else{
                    if(res.affectedRows >  0) resolve(true);
                    if(res.affectedRows == 0) resolve(false);
                }
            }
    );
});

const getCategoryById = (id) => new Promise(async(resolve, reject) => {
    /**
     *  Eliminar una categoria.
     */
    pool.query('SELECT nombre FROM platillos_categorias WHERE id = ?', 
        [id],
            (err, res) => {
                if(err){
                    throw err;
                }else{
                    const value = res[0].nombre;
                    if(value != '' && value != null) resolve(value);
                    if(value == '' || value == null) resolve('NULL');
                }
            }
    );
});

module.exports = {
    createNewCategory,
    updateCategory,
    showCategories,
    deleteCategory,
    showLastCategory,
    getCategoryById
}