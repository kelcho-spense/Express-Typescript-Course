export interface Iconfig  {
    port:  number;
    db: {
        user: string;
        password: string;
        server: string;
        database: string;
        options: {
            encrypt: boolean;
            trustServerCertificate: boolean;
        };
    };
    jwtSecret: string;
}