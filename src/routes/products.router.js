import { Router } from 'express';
import ProductModel from '../models/product.model.js';

const router = Router();

// Obtener Lista de todos los productos
router.get('/', async (req, res) => {
  try {
    //const { limit = 10, page = 1, sort, query } = req.query;
    const limit = parseInt(req.query.limit ?? 10);
    const page = parseInt(req.query.page ?? 1);

    const sort = req.query.sort ? req.query.sort.toLowerCase() : null;
    const query = req.query.query ?? null;

    const skip = (page - 1) * limit;

    let queryOptions = {};
    let queryString = '';
    if (query) {
      //queryOptions = { $or: [{ 'category': query }, { 'price': query }] };
      queryOptions = { 'category': query };
      queryString = query;
    }

    let sortOptions = {};
    let sortString = '';
    if (sort) {
      if (sort === 'asc' || sort === 'desc') {
        sortOptions.price = sort === 'asc' ? 1 : -1;
        sortString = `&sort=${sort}`;
      }
    }

    const products = await ProductModel
      .find(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await ProductModel.countDocuments(queryOptions);

    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}${sortString}${queryString}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}${sortString}${queryString}` : null,
    });

  } catch (error) {
    console.log("Error al obtener productos:", error.message);
    res.status(500).json({
      status: 'error',
      payload: null,
      error: `Error interno del servidor: ${error.message}`
    });
  }
});

// Obtener Producto según su Id
router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await ProductModel.findById(pid).lean();

    if (!product) {
      return res.status(404).json({ status: 'error', payload: null, message: 'Producto no encontrado.' });
    }

    return res.status(200).json({ status: 'success', payload: product, message: 'Producto encontrado.' });
  } catch (error) {
    console.log("Error al recuprar un producto: ", error.message);
    return res.status(500).json({ status: 'error', message: 'Error al recuperar producto: ' + error.message });
  }
});

// Crear nuevo Producto
router.post('/', async (req, res) => {
  try {
    const { name, price, stock, category, thumbnail } = req.body;
    const product = await ProductModel.create({ name, price, stock, category, thumbnail });
    return res.status(200).json({ status: 'success', payload: product, message: 'Producto creado correctamente.' });
  } catch (error) {
    console.log("Error al crear el producto: ", error.message);
    return res.status(500).json({ status: 'error', payload: null, message: 'Error al recuperar producto: ' + error.message });
  }
});

// Actualizar un Producto según su Id
router.put('/:pid', async (req, res) => {
  try {

    const product = await ProductModel.findByIdAndUpdate(id, productUpdated, { returnDocument: 'after' });

    if (!product) {
      return res.status(404).json({ status: 'error', payload: null, message: 'Producto no encontrado.' });
    }

    //console.log("Product actualizado correctamente.");
    return await product.save();
  } catch (error) {
    console.log("Error al actualizar el producto: ", error);
    return null;
  }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try {

    const product = await ProductModel.findByIdAndUpdate(id, productUpdated, { returnDocument: 'after' });

    if (!product) {
      return res.status(404).json({ status: 'error', payload: null, message: 'Producto no encontrado.' });
    }

    //console.log("Product eliminado correctamente.");
    await product.save();
    return res.status(200).json({ status: 'error', payload: null, message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.log("Error al actualizar el producto: ", error);
    return null;
  }
});

export default router;
