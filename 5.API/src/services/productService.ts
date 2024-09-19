// src/services/productService.ts
import db from '../config/db';
import { Product } from '../models/Product';
import { v4 as uuidv4 } from 'uuid';

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

// Implement read, update, delete services similarly.