import { Router } from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const router = Router();

// Listar carritos
router.get('/', async (req, res) => {
  try {
    const carts = await CartModel.find().lean();
    res.status(200).json({ status: 'success', payload: carts, message: 'Carritos recuperados.' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: null, message: 'Error al recuperar Carritos: ' + error.message });
  }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const cart = await CartModel.create({products: []});
    res.status(200).json({ status: 'success', payload: cart, message: 'Carrito creado correctamente.' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: null, message: 'Error al recuperar Carrito: ' + error.message });
  }
});

// Listar productos de un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await CartModel.findById(cid).lean();

    if (!cart) res.status(404).json({ status: 'error', payload: null, message: 'Carrito no encontrado.' });

    res.status(200).json({ status: 'success', payload: cart, message: 'Carrito recuperado.' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: null, message: 'Error al recuperar Carrito: ' + error.message });
  }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {

  try {

    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await CartModel.findById(cid);
    if (!cart) res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });

    const product = await ProductModel.findById(pid).lean();
    if (!product) res.status(404).json({ status: 'error', message: 'Producto No encontrado.' });

    const productIndex = cart.products.findIndex(item => item.product._id.toString() == pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
      //cart.products[productIndex].price = product.price;
    } else {
      cart.products.push({ product: product, quantity: 1, price: product.price });
    }

    await cart.save();

    res.status(200).json({ status: 'success', payload: cart, message: 'Producto agregado al Carrito correctamente.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al agregar Producto al Carrito: ' + error.message });
  }
});

// Actualizar lista de productos del carrito
router.put('/:cid', async (req, res) => {
  // No está claro el enunciado, si se adjunta listado de IDs de productos o es el listado con el formato correcto (producto (objeto) y cantidad).
  // Se tomará esta segunda alternativa para un reemplazo directo

  try {

    const cid = req.params.cid;
    const products = req.body.products ?? [];

    const cart = await CartModel.findById(cid);
    if (!cart) res.status(404).json({ status: 'error', message: 'Carrito no encontrado.' });

    if (products.length == 0) res.status(400).json({ status: 'error', message: 'No se adjunta o está vacío el listado de Productos.' });

    cart.products = products;

    await cart.save();

    res.status(200).json({ status: 'success', payload: cart, message: 'Listado de Propductos del Carrito reemplazado correctamente.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al reemplazar listado de productos al Carrito: ' + error.message });
  }
});

// Agregar un producto al carrito
router.put('/:cid/product/:pid', async (req, res) => {

  try {

    const cid = req.params.cid;
    const pid = req.params.pid;
    const qty = req.body.qty ?? 0; //el usuario puede enviar valores negativos, se controla despues

    const cart = await CartModel.findById(cid);
    if (!cart) res.status(404).json({ status: 'error', payload: null, message: 'Carrito no encontrado.' });

    const product = await ProductModel.findById(pid).lean();
    if (!product) res.status(404).json({ status: 'error', payload: null, payload: null, message: 'Producto no encontrado.' });

    if (qty <=0) res.status(404).json({ status: 'error', payload: null, message: 'La cantidad del producto debe ser mayor a 0 para modificar el carrito.' });

    const productIndex = cart.products.findIndex(item => item.product._id.toString() == pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = qty;
      //cart.products[productIndex].price = product.price;
    } else {
      cart.products.push({ product: product, quantity: 1, price: product.price });
    }

    await cart.save();

    res.status(200).json({ status: 'success', payload: cart, message: 'Producto agregado al Carrito correctamente.' });
  } catch (error) {
    console.log("Error al agregar PRoducto al Carrito: ", error.message);
    res.status(500).json({ status: 'error', payload: null, message: 'Error al agregar PRoducto al Carrito: ' + error.message });
  }
});

// eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {

  try {

    const cid = req.params.cid;

    const cart = await CartModel.findById(cid);
    if (!cart) res.status(404).json({ status: 'error', payload: null, message: 'Carrito no encontrado.' });

    cart.products = [];

    await cart.save();

    res.status(200).json({ status: 'success', payload: cart, message: 'Se eliminaron productos del Carrito correctamente.' });
  } catch (error) {
    res.status(500).json({ status: 'error', payload: null, message: 'Error al eliminar Productos del Carrito: ' + error.message });
  }
});

// eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await CartModel.findById(cid);
    if (!cart) res.status(404).json({ status: 'error', payload: null, message: 'Carrito no encontrado.' });

    cart.products = cart.products.filter(item => item.product._id.toString() !== pid);

    await cart.save();

    res.status(200).json({ status: 'success', payload: cart, message: 'Producto agregado al Carrito correctamente.' });
  } catch (error) {
    console.log("Error al agregar PRoducto al Carrito: ", error.message);
    res.status(500).json({ status: 'error', payload: null, message: 'Error al eliminar Producto al Carrito: ' + error.message });
  }
});

export default router;
