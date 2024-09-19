// src/controllers/productController.ts
import { Request, Response } from 'express';
import { createProduct, getProductById, getAllProducts, updateProduct, deleteProduct } from '../services/productService';

// Create Product Endpoint
export const createProductController = async (req: Request, res: Response) => {
    const { name, description, price } = req.body;

    try {
        const product = await createProduct(name, description, price);
        res.status(201).json({ message: 'Product created successfully.', product });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to create product.', error: error.message });
    }
};

// Get Single Product Endpoint
export const getProductController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await getProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve product.', error: error.message });
    }
};

// Get All Products Endpoint
export const getAllProductsController = async (req: Request, res: Response) => {
    try {
        const products = await getAllProducts();
        res.status(200).json({ products });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to retrieve products.', error: error.message });
    }
};

// Update Product Endpoint
export const updateProductController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedFields = req.body;

    try {
        const updatedProduct = await updateProduct(id, updatedFields);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully.', updatedProduct });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to update product.', error: error.message });
    }
};

// Delete Product Endpoint
export const deleteProductController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await deleteProduct(id);
        res.status(204).send(); // No content
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete product.', error: error.message });
    }
};
