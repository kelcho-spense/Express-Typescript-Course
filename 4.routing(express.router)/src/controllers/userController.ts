import { getAllUsers } from '../services/userService';
import {  RequestHandler } from 'express';
export const getUsers: RequestHandler = (req, res) => {
  const users: string[] = getAllUsers();
  res.status(200).json({ users: users });
};