const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.NODE_ENV === "test"
    ? process.env.DATABASE_TEST_URL

    : process.env.DATABASE_URL,
});

module.exports = { pool };
