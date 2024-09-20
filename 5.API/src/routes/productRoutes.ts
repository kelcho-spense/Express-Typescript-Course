// src/routes/productRoutes.ts
import express from 'express';
import { createProductController, getProductController, getAllProductsController, updateProductController, deleteProductController } from '../controllers/productController';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const productRoutes = express.Router();


productRoutes.use(deserializeUser);
// Product CRUD routes
productRoutes.post('/',requireUser, createProductController); // Create product
productRoutes.get('/:id',requireUser, getProductController);  // Get a single product by ID
productRoutes.get('/',requireUser, getAllProductsController); // Get all products
productRoutes.put('/:id',requireUser, updateProductController); // Update a product by ID
productRoutes.delete('/:id',requireUser, deleteProductController); // Delete a product by ID

export default productRoutes;
