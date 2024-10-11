import { Router } from 'express';
import ProductModel from "../models/product.model.js";

const router = Router();

// Listar productos de un carrito por ID
router.get('/', async (req, res) => {
  const titulo = 'Nuestros Productos';
  const productos = await ProductModel.find({ }).lean();
  res.render("home", {titulo, productos});
});

// Listar productos de un carrito por ID
router.get('/realtimeproducts', async (req, res) => {
  const titulo = 'Gestión de Productos en RealTime 😎';
  const productos = await ProductModel.find({ }).lean();
  res.render("realtimeproducts", {titulo, productos});
});

export default router;
