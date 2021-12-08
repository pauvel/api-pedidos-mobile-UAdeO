const express = require('express');
const router = express.Router();
const { createNewCategory, updateCategory, showCategories, deleteCategory, showLastCategory, getCategoryById } = require('../../utils/db/shop-category-crud');
const { createProduct, updateProduct, deleteProduct, showProducts, showProductByCategory, getProductDetails, getProductById, getIngredientById } = require('../../utils/db/platillos-crud');
const { getAllIngredients, createIngredient, deleteIngredient, updateIngredient, createIngredientForProduct, deleteIngredientForProduct } = require('../../utils/db/ingredients-crud');
const { audit } = require('../../security/audit');
const { setLike, userHasLikeOnProduct } = require('../../utils/querys/mobile/likes');

/**
 * Obtener todas las @categorias del sistema.
 */
router.get('/show/categories', async(req, res) => {
    await showCategories()
                    .then((data) => {
                        if(!data) return res.json(data);
                        return res.json(data);
                    }).catch(err => {
                        console.log('Error showing categories :>> ', err);
                        return res.sendStatus(500);
                    });
});

/**
 * Obtener la ultima @categoria agregada al sistema.
 */
router.get('/show/categories/last', async(req, res) => {
    await showLastCategory()
                    .then((data) => {
                        if(!data) return res.json(data);
                        return res.json(data);
                    }).catch(err => {
                        console.log('Error Showing last category :>> ', err);
                        return res.sendStatus(500);
                    });
});

/**
 *  Agregar una @categoria al sistema.
 */
router.post('/add/category', async(req, res) => {
    const { nombre } = req.body;

    await createNewCategory(nombre)
                    .then(async(result) => {
                     if(!result) return res.sendStatus(404);
                     await audit({usuario:'Super user', accion:`Agrego la categoria ${nombre}`, satisfactorio:'si', ip:'N/A'});
                     return res.sendStatus(200);
                    }).catch(err => {
                        console.log('Error creating category :>> ', err);
                        return res.sendStatus(500);
                    });
});

/**
 *  Editar una @categoria del sistema.
 */
router.put('/update/category', async(req, res) => {
    const { id, nuevo } = req.body;
    const valueToupdate = await getCategoryById(id);
    await updateCategory(id, nuevo)
                        .then(async(result)=>{
                            if(!result) return res.sendStatus(404);
                            await audit({usuario:'Super user', accion:`Edito la categoria ${valueToupdate} por ${nuevo}`, satisfactorio:'si', ip:'N/A'});
                            return res.sendStatus(200);
                        }).catch(err => {
                            console.log('Error updating category :>> ', err);
                            return res.sendStatus(500);
                        });
});

/**
 *  Eliminar @categoria
 */
router.delete('/delete/category/:id', async(req, res) => {
    const { id } = req.params;
    const valueToupdate = await getCategoryById(id);

    await deleteCategory( id )
        .then(async(result)=>{
            if(!result) return res.sendStatus(404);
            await audit({usuario:'Super user', accion:`Elimino categoria ${valueToupdate}`, satisfactorio:'si', ip:'N/A'});
            return res.sendStatus(200);
        }).catch(err => {
            console.log('Error deleting category :>> ', err);
            return res.sendStatus(500);
        });
});

/**
 *  Mostrar todos los @productos acorde el nombre de una @categoria
 *  [Exclusivo para el gestor web]
 */
router.get('/show/products', async(req, res) => {
    const { category } = req.query;
    await showProducts(category)
            .then( data => (data) ? 
            res.json(data) : 
            res.json(data))
            .catch(err => console.log(err));
});

/***
 * Obtiene los ingredientes / Detalles que contiene un producto y que el cliente puede modificar.
 * @product = platillo.
 */

router.get('/show/:product/ingredients', async (req, res) => {
    const { product } = req.params;
    await getProductDetails(product)
            .then( (result) => {
                return res.json(result);
            }).catch( (err) => {
                return res.sendStatus(500);
            });
});

/***
 * Obtiene un producto por su ID
 * @product = platillo.
 */
router.get('/show/:product/product_info', async (req, res) => {
    const { product } = req.params;
    await getProductById(product)
            .then( (result) => {
                return res.json(result);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/***
 * Obtiene un ingrediente por su ID
 * @ingredient = ingrediente.
 */
router.get('/show/:ingredient/ingredient_info', async (req, res) => {
    const { ingredient } = req.params;
    await getIngredientById(ingredient)
            .then( (result) => {
                return res.json(result);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Agregar nuevo @producto
 */
router.post('/add/product', async(req, res) => {
    const productData = req.body;
    await createProduct( productData )
            .then( isOk => (isOk) ? 
                res.sendStatus(201)
                 :
                res.sendStatus(409)
            ).catch(err => console.log(err));
});

/**
 *  Actualizar un producto.
 *  @param { Identificador unico del objeto } id.
 */
router.put('/update/product/:id', async(req, res) => {
    const { nombre, descripcion, precioch, preciog, unitario, url, categoria } = req.body;
    const { id } = req.params;
    await updateProduct(id, nombre, descripcion, precioch, preciog, unitario, url, categoria)
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((e) => {
                return res.sendStatus(500);
            });
});

router.delete('/delete/product/:id', async (req, res) => {
    const { id } = req.params;
    await deleteProduct( id )
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((e) => {
                return res.sendStatus(500);
            });
});
/**
 *  Obtener todos los @productos acorde el id de @categoria
 *  [Para movil]
 */
router.get('/show/product_by_category/:category', async(req, res)=>{
    const { category } = req.params;
    await showProductByCategory( category )
            .then((result) => {
                if(result){
                    res.json(result);
                }else{
                    res.sendStatus(404);
                }
            }).catch((err) => {
                console.log('Error showProductByCategory :>> ', err);
            });
});

/**
 *  recibe @cliente y @producto y valida si el like existe o no.
 */
router.post('/like', async(req, res) => {
    const { product, client } = req.body;
    await setLike(client, product).then( ( result ) => {
        if(result<1) return res.sendStatus(404);
        return res.sendStatus(200);
    }).catch((err) => {
        return res.sendStatus(500);
    });
});

/**
 *  Likes logic.
 */
router.post('/like/validate', async(req, res) => {
    const { product, client } = req.body;
    await userHasLikeOnProduct(client, product).then( ( result ) => {
        if(result == 'like') return res.sendStatus(404);
        return res.sendStatus(200);
    }).catch((err) => {
        return res.sendStatus(500);
    });
});

/**
 *  Muestra todos los ingredientes existentes.
 */
router.get('/show/ingredients', async (req, res) => {
    await getAllIngredients()
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((e) => {
                return res.sendStatus(500);
            });
});

/**
 *  Obtener un ingrediente por su id.
 */
// router.get('/show/ingredient/:id', async (req, res) => {
//     const { id } = req.params;
//     await getIngredientById(id)
//             .then((r) => {
//                 if(r == null) return res.sendStatus(404);
//                 return res.json(r);
//             }).catch((e) => {
//                 return res.sendStatus(500);
//             });
// });

/**
 *  Crea un nuevo ingrediente.
 */
router.post('/create/ingredient', async (req, res) => {
    const  { name } = req.body;
    await createIngredient(name)
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Actualiza el nombre de un ingrediente.
 */
router.put('/edit/ingredient/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await updateIngredient(id, name)
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Elimina un ingrediente.
 */
router.delete('/delete/ingredient/:id', async (req, res) =>{
    const { id } = req.params;
    await deleteIngredient(id)
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Agregar ingrediente a un producto.
 */
router.post('/add/product_to_ingredient', async (req, res) => {
    const { productId, ingredientId } = req.body;
    await createIngredientForProduct(productId, ingredientId)
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});

/**
 *  Quitar ingrediente a un producto.
 */
router.post('/quit/ingredient_to_product', async (req, res) => {
    const { productId, ingredientId } = req.body;
    await deleteIngredientForProduct(productId, ingredientId)
            .then((r) => {
                if(r == null) return res.sendStatus(404);
                return res.json(r);
            }).catch((err) => {
                return res.sendStatus(500);
            });
});
module.exports = router;