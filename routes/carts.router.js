import { Router } from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const router = Router();

// Listar productos de un carrito por ID
router.get('/', async (req, res) => {
    try {
        const cart = await CartModel.find().lean();
        return res.status(200).json({ status: 'success', payload: cart, message: 'Carritos recuperados.' });
    } catch (error) {
        console.log("Error al recuprar un Carrito: ", error.message);
        return res.status(500).json({ status: 'error', message: 'Error al recuperar Carritos: ' + error.message });
    }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = await CartModel.create();
        return res.status(200).json({ status: 'success', payload: cart, message: 'Carrito creado correctamente.' });
    } catch (error) {
        console.log("Error al recuprar un Carrito: ", error.message);
        return res.status(500).json({ status: 'error', message: 'Error al recuperar Carrito: ' + error.message });
    }
});

// Listar productos de un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await CartModel.findById(cid).lean();

        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });

        return res.status(200).json({ status: 'success', payload: cart, message: 'Carrito recuperado.' });
    } catch (error) {
        console.log("Error al recuprar un Carrito: ", error.message);
        return res.status(500).json({ status: 'error', message: 'Error al recuperar Carrito: ' + error.message });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {

    try {

        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });

        const product = await ProductModel.findById(pid).lean();
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });

        const productIndex = cart.products.findIndex(item => item.product._id.toString() == pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
            //cart.products[productIndex].price = product.price;
        } else {
            cart.products.push({ product: product, quantity: 1, price: product.price });
        }

        await cart.save();

        return res.status(200).json({ status: 'success', payload: cart, message: 'Producto agregado al Carrito correctamente.' });
    } catch (error) {
        console.log("Error al agregar PRoducto al Carrito: ", error.message);
        return res.status(500).json({ status: 'error', message: 'Error al agregar PRoducto al Carrito: ' + error.message });
    }
});

// Agregar un producto al carrito
router.put('/:cid/product/:pid', async (req, res) => {

    try {

        const cid = req.params.cid;
        const pid = req.params.pid;
        const qty = req.body.qty ?? 0; //el usuario puede enviar valores negativos, se controla despues

        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });

        const product = await ProductModel.findById(pid).lean();
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });

        if (qty <= 0) return res.status(404).json({ status: 'error', message: 'La cantidad del producto debe ser mayor a 0 para modificar el carrito.' });

        const productIndex = cart.products.findIndex(item => item.product._id.toString() == pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity = qty;
            //cart.products[productIndex].price = product.price;
        } else {
            cart.products.push({ product: product, quantity: 1, price: product.price });
        }

        await cart.save();

        return res.status(200).json({ status: 'success', payload: cart, message: 'Producto agregado al Carrito correctamente.' });
    } catch (error) {
        console.log("Error al agregar PRoducto al Carrito: ", error.message);
        return res.status(500).json({ status: 'error', message: 'Error al agregar PRoducto al Carrito: ' + error.message });
    }
});

export default router;
