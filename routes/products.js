const express = require('express');
const fs = require('fs');
const router = express.Router();
const productsFilePath = './data/productos.json';

// Para leer productos desde el archivo JSON
function readProducts() {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
}

// Para escribir productos al archivo JSON
function writeProducts(products) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Obtener Lista todos los productos
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// Obtener producto por ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find((p) => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: String(products.length + 1),
        ...req.body,
        status: req.body.status !== undefined ? req.body.status : true
    };

    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
    products[index] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
});

// DELETE /:pid - Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const updatedProducts = products.filter(p => p.id !== req.params.pid);
    if (products.length === updatedProducts.length) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    writeProducts(updatedProducts);
    res.status(204).send();
});

module.exports = router;
