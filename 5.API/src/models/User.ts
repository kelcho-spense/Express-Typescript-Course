// src/models/User.ts
export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // Hashed password
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
  }