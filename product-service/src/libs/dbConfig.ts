const { DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const bdConfig = {
  host: DB_HOST,
  port: +DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export default bdConfig;
