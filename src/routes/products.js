import { Router } from 'express';
const router = Router();
import ProductManager from '../controller/productManager.js'
import { socketServer } from '../app.js';
const productManager = new ProductManager('product.json');


router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    const {limit} = req.query
    const productLimit = products.slice(0, limit);
    
    res.json(productLimit);
})

router.get('/:pid', async(req, res) => {
    const {pid} = req.params
    const product = await productManager.getProductById(Number(pid))
    res.send(product)
})

router.post('/', async(req, res) => {
    try {
        const {title, description, price, thumbnail, code, stock} = req.body;
        const addProduct =  await productManager.addProducts(title, description, price, code, stock, thumbnail);
        socketServer.emit('productAdded', addProduct);
        res.send('producto agregado')
        
    } catch (error) {
        console.log(error);
    }
})

router.delete('/:pid', async(req, res) => {
    try {
        const {pid} = req.params;
        await productManager.deleteProduct(Number(pid));
        const productos = await productManager.getProductById(pid)
        socketServer.emit('productRemoved', pid);
        res.send('producto eliminado')
    } catch (error) {
        console.log(error);
    }
})

router.put('/:pid', async(req, res) => {
    const {pid} = req.params;
    const {title, description, price, code, stock} = req.body
    await productManager.updateProduct(Number(pid), title, description, price, code, stock);
    const product = await productManager.getProducts();
    res.send(product)
})




export default router;