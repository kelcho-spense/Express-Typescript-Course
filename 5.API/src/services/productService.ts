// src/services/productService.ts
import db from '../config/db';
import { Product } from '../models/Product';
import { v4 as uuidv4 } from 'uuid';

// CREATE: Add a new product
export const createProduct = async (name: string, description: string, price: number): Promise<Product> => {
  const product: Product = {
    id: uuidv4(),
    name,
    description,
    price,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.poolConnect;
  const request = db.pool.request();
  await request.input('id', db.sql.VarChar, product.id)
    .input('name', db.sql.VarChar, product.name)
    .input('description', db.sql.VarChar, product.description)
    .input('price', db.sql.Decimal, product.price)
    .input('createdAt', db.sql.DateTime, product.createdAt)
    .input('updatedAt', db.sql.DateTime, product.updatedAt)
    .query(`
      INSERT INTO Products (id, name, description, price, createdAt, updatedAt)
      VALUES (@id, @name, @description, @price, @createdAt, @updatedAt)
    `);

  return product;
};

// READ: Get a product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  await db.poolConnect;
  const request = db.pool.request();
  const result = await request.input('id', db.sql.VarChar, id)
    .query('SELECT * FROM Products WHERE id = @id');

  return result.recordset[0] || null;
};

// READ: Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  await db.poolConnect;
  const request = db.pool.request();
  const result = await request.query('SELECT * FROM Products');

  return result.recordset;
};

// UPDATE: Update an existing product by ID
export const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<Product | null> => {
  const { name, description, price } = updatedFields;
  
  await db.poolConnect;
  const request = db.pool.request();

  // Update the fields, if they are provided
  await request
    .input('id', db.sql.VarChar, id)
    .input('name', db.sql.VarChar, name || null)
    .input('description', db.sql.VarChar, description || null)
    .input('price', db.sql.Decimal, price || null)
    .input('updatedAt', db.sql.DateTime, new Date())
    .query(`
      UPDATE Products
      SET 
        name = ISNULL(@name, name),
        description = ISNULL(@description, description),
        price = ISNULL(@price, price),
        updatedAt = @updatedAt
      WHERE id = @id
    `);

  // Retrieve the updated product
  const updatedProduct = await getProductById(id);
  return updatedProduct;
};

// DELETE: Delete a product by ID
export const deleteProduct = async (id: string): Promise<void> => {
  await db.poolConnect;
  const request = db.pool.request();
  await request.input('id', db.sql.VarChar, id)
    .query('DELETE FROM Products WHERE id = @id');
};
