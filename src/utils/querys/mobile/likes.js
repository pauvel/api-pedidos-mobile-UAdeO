const pool = require('../../../dbshop');
const pooldb = require('../../../dbshop');

const setLike = async(client, product) => {
    /**
     *  Si el cliente tiene like en el producto se eliminara el registro,
     *  de lo contrario se agregara un nuevo registro.
     *  aumenta likes en productos en 1
     *  disminuye likes en productos en 1
     */
    let queryAffrws = 0;
    return await userHasLikeOnProduct(client, product).then( async( resultFromUserHasLike ) => {
        const queryToLike   = 'INSERT INTO clientes_con_favoritos set ?;';
        const queryToDisike = 'DELETE FROM clientes_con_favoritos WHERE cliente_id = ? AND platillo_id = ?;';
        const queryToIncrementLikes = 'UPDATE platillos SET likes = likes + 1 WHERE id = ?;';
        const queryToDecrementLikes = 'UPDATE platillos SET likes = likes - 1 WHERE id = ?;';
        
        return new Promise( async (resolve, reject) => {
            switch ( resultFromUserHasLike ) {
                case 'like':
                    const objFav = { cliente_id: client, platillo_id: product };
                    const queryResult1 = await pool.query(queryToLike, [objFav]);
                    await pool.query(queryToIncrementLikes, [product]);
                    if(queryResult1.affectedRows > 0){
                        queryAffrws += 1;
                    }
                    break;
            
                case 'dislike':
                    const queryResult2 = await pool.query(queryToDisike, [client, product]);
                    await pool.query(queryToDecrementLikes, [product]);
                    if(queryResult2.affectedRows > 0){
                        queryAffrws += 1;
                    }
                    break;
            }
            resolve(queryAffrws);
        });
    }).catch((err) => {
        console.log('err :>> ', err);
    });
};

const userHasLikeOnProduct = (client, product) => {
    /**
     *  Valida si el cliente tiene like en el producto.
     */
    return new Promise( async(resolve, reject) => {
        const query = `
            SELECT id FROM clientes_con_favoritos WHERE cliente_id = ? AND platillo_id = ?;
        `.trim();
        await pool.query(query, [client, product] ,(err, res) => {
            if(res != ""){
                resolve('dislike');
            }else{
                resolve('like');
            }
        });
    });
};


module.exports = {
    setLike,
    userHasLikeOnProduct
}