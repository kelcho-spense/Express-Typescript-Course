/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Desired username for the new user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the new user
 *         password:
 *           type: string
 *           description: Password for the new user
 * 
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password of the user
 * 
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Refresh token to obtain a new access token
 * 
 *     RefreshTokenResponse:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: New JWT access token
 *         refreshToken:
 *           type: string
 *           description: New JWT refresh token
 * 
 *     Session:
 *       type: object
 *       required:
 *         - id
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the session
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session was last updated
 * 
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *         - password
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Hashed password of the user
 *         profileImage:
 *           type: string
 *           format: url
 *           description: URL to the user's profile image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 * 
 *     PartialUser:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 * 
 *     LoginResponse:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *         - user
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token for authenticated requests
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token for obtaining new access tokens
 *         user:
 *           $ref: '#/components/schemas/PartialUser'
 */

export interface User {
  id: string;           // Unique identifier for the user
  username: string;     // Username for the user
  email: string;        // Email of the user
  password: string;     // Hashed password of the user
  profileImage?: string; // Optional profile image URL
  createdAt: Date;      // Timestamp when the user was created
  updatedAt: Date;      // Timestamp when the user was last updated
}

// This could be a partial interface for login response, excluding password.
export interface LoginResponse {
  accessToken: string;  // JWT Access token for the user session
  refreshToken: string; // JWT Refresh token to renew the session
  user: {
      id: string;       // User ID
      username: string; // Username of the user
      email: string;    // Email of the user
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
