import { Iconfig } from "../types";
import "dotenv/config";

export const config: Iconfig = {
    port: Number(process.env.PORT) || 5000,
    db: {
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        server: process.env.DB_SERVER!,
        database: process.env.DB_DATABASE!,
        options: {
            encrypt: true, // For Azure
            trustServerCertificate: true, // Change to true for local dev
        },
    },
    jwtSecret: process.env.JWT_SECRET!,
};