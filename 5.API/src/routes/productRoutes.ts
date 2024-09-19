// src/routes/productRoutes.ts
import express from 'express';
import { createProductController, getProductController, getAllProductsController, updateProductController, deleteProductController } from '../controllers/productController';

const productRoutes = express.Router();

// Product CRUD routes
productRoutes.post('/', createProductController); // Create product
productRoutes.get('/:id', getProductController);  // Get a single product by ID
productRoutes.get('/', getAllProductsController); // Get all products
productRoutes.put('/:id', updateProductController); // Update a product by ID
productRoutes.delete('/:id', deleteProductController); // Delete a product by ID

export default productRoutes;
