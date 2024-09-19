// src/config/db.ts
import sql from 'mssql';
import { config } from './index';

const pool = new sql.ConnectionPool(config.db);
const poolConnect = pool.connect();

pool.on('error', (err) => {
  console.error('SQL Pool Error: ', err);
});

export default {
  sql,
  poolConnect,
  pool,
};