// src/services/userService.ts
import db from '../config/db';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { config } from '../config';

const saltRounds = 10;

//register user
export const registerUser = async (username: string, email: string, password: string, profileImage?: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user: User = {
        id: uuidv4(),
        username,
        email,
        password: hashedPassword,
        profileImage,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.poolConnect;
    const request = db.pool.request();
    await request.input('id', db.sql.VarChar, user.id)
        .input('username', db.sql.VarChar, user.username)
        .input('email', db.sql.VarChar, user.email)
        .input('password', db.sql.VarChar, user.password)
        .input('profileImage', db.sql.VarChar, user.profileImage || null)
        .input('createdAt', db.sql.DateTime, user.createdAt)
        .input('updatedAt', db.sql.DateTime, user.updatedAt)
        .query(`
      INSERT INTO Users (id, username, email, password, profileImage, createdAt, updatedAt)
      VALUES (@id, @username, @email, @password, @profileImage, @createdAt, @updatedAt)
    `);

    return user;
};

// login user
export const loginUser = async (email: string, password: string): Promise<{ token: string; user: Partial<User> }> => {
    await db.poolConnect;
    const request = db.pool.request();
    const result = await request
        .input('email', db.sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');

    const user: User = result.recordset[0];

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };
};

// read all users
export const getAllUsers = async (): Promise<Partial<User>[]> => {
    await db.poolConnect;
    const request = db.pool.request();
    const result = await request.query('SELECT id, username, email, profileImage, createdAt FROM Users');

    const users: Partial<User>[] = result.recordset;

    return users;
};

//update user 
export const updateUser = async (id: string, updatedFields: Partial<User>): Promise<User> => {
    const { username, email, profileImage, password } = updatedFields;

    await db.poolConnect;
    const request = db.pool.request();

    if (password) {
        updatedFields.password = await bcrypt.hash(password, saltRounds);
    }

    await request
        .input('id', db.sql.VarChar, id)
        .input('username', db.sql.VarChar, username || null)
        .input('email', db.sql.VarChar, email || null)
        .input('profileImage', db.sql.VarChar, profileImage || null)
        .input('password', db.sql.VarChar, updatedFields.password || null)
        .input('updatedAt', db.sql.DateTime, new Date())
        .query(`
        UPDATE Users
        SET 
          username = ISNULL(@username, username),
          email = ISNULL(@email, email),
          password = ISNULL(@password, password),
          profileImage = ISNULL(@profileImage, profileImage),
          updatedAt = @updatedAt
        WHERE id = @id
      `);

    const updatedUser = await request
        .input('id', db.sql.VarChar, id)
        .query('SELECT * FROM Users WHERE id = @id');

    return updatedUser.recordset[0];
};

// delete user 
export const deleteUser = async (id: string): Promise<void> => {
    await db.poolConnect;
    const request = db.pool.request();

    await request.input('id', db.sql.VarChar, id).query('DELETE FROM Users WHERE id = @id');
};

// Authenticate and issue tokens
export const authenticateUser = async (email: string, password: string): Promise<{ accessToken: string, refreshToken: string }> => {
    await db.poolConnect;
    const request = db.pool.request();

    // Query the user by email
    const result = await request.input('email', db.sql.VarChar, email).query('SELECT * FROM Users WHERE email = @email');
    const user: User = result.recordset[0];

    if (!user) {
        throw new Error('User not found');
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Issue access and refresh tokens
    const accessToken = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '7d' });

    // Store the refresh token in a Sessions table (implementation below)
    await request
        .input('userId', db.sql.VarChar, user.id)
        .input('refreshToken', db.sql.VarChar, refreshToken)
        .query(`
      INSERT INTO Sessions (userId, refreshToken, createdAt, updatedAt)
      VALUES (@userId, @refreshToken, GETDATE(), GETDATE())
    `);

    return {
        accessToken,
        refreshToken,
    };
};

// active sessions
export const getSessions = async (userId: string): Promise<{ refreshToken: string, createdAt: Date, updatedAt: Date }[]> => {
    await db.poolConnect;
    const request = db.pool.request();

    const result = await request
        .input('userId', db.sql.VarChar, userId)
        .query('SELECT refreshToken, createdAt, updatedAt FROM Sessions WHERE userId = @userId');

    return result.recordset;
};

// Refresh Token
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, config.jwtSecret) as { id: string, email: string };
        const { id, email } = decoded;

        await db.poolConnect;
        const request = db.pool.request();

        // Check if the refresh token exists in the sessions table
        const result = await request
            .input('refreshToken', db.sql.VarChar, refreshToken)
            .query('SELECT * FROM Sessions WHERE refreshToken = @refreshToken');

        if (!result.recordset.length) {
            throw new Error('Invalid refresh token');
        }

        // If valid, issue a new access token
        const newAccessToken = jwt.sign({ id, email }, config.jwtSecret, { expiresIn: '15m' });

        return newAccessToken;
    } catch (error:any) {
        throw new Error('Could not refresh access token: ' + error.message);
    }
};

// delete session(logout)
export const deleteSession = async (refreshToken: string): Promise<void> => {
    await db.poolConnect;
    const request = db.pool.request();

    // Remove the refresh token from the Sessions table
    await request
        .input('refreshToken', db.sql.VarChar, refreshToken)
        .query('DELETE FROM Sessions WHERE refreshToken = @refreshToken');
};

/** Delete All Sessions (Logout from all devices)
 * This is a useful service to log a user out from all sessions (all devices).
 * */
 export const deleteAllSessions = async (userId: string): Promise<void> => {
    await db.poolConnect;
    const request = db.pool.request();

    // Remove all sessions for the user
    await request
        .input('userId', db.sql.VarChar, userId)
        .query('DELETE FROM Sessions WHERE userId = @userId');
};
