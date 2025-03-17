require('dotenv').config({ path: 'dbConfig.env' });
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 5000
    },
    requestTimeout: 3000,
    connectionTimeout: 3000
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to Azure SQL Database");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });

module.exports = { sql, poolPromise };
