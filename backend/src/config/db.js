import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  MYSQL_HOST = "localhost",
  MYSQL_PORT = 3306,
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
  MYSQL_DATABASE = "restaurant_system",
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_HOST,

  port: Number(MYSQL_PORT),

  user: MYSQL_USER,

  password: MYSQL_PASSWORD,

  database: MYSQL_DATABASE,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,
});


// TEST DATABASE CONNECTION
export const connectDB = async () => {

  try {

    const connection = await pool.getConnection();

    console.log("MySQL Connected Successfully");

    connection.release();

  } catch (error) {

    console.error("Database Connection Failed");
    console.error(error.message);

    process.exit(1);
  }

};


// QUERY HELPER
export const query = (...args) => pool.query(...args);


// EXPORT POOL
export default pool;