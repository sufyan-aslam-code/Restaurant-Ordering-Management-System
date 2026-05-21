import mysql from "mysql2/promise";

const {
  MYSQL_HOST = "localhost",
  MYSQL_PORT = 3306,
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
  MYSQL_DATABASE = "restaurant_system",
} = process.env;

const baseConfig = {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    fullName VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(30) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    emailVerified TINYINT(1) NOT NULL DEFAULT 0,
    emailVerificationTokenHash VARCHAR(255) DEFAULT NULL,
    emailVerificationTokenExpiresAt DATETIME DEFAULT NULL,
    passwordResetTokenHash VARCHAR(255) DEFAULT NULL,
    passwordResetTokenExpiresAt DATETIME DEFAULT NULL,
    profileImageUrl VARCHAR(512) DEFAULT NULL,
    refreshTokenHash VARCHAR(255) DEFAULT NULL,
    refreshTokenExpiresAt DATETIME DEFAULT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_email (email),
    KEY idx_email_verification_token (emailVerificationTokenHash),
    KEY idx_password_reset_token (passwordResetTokenHash)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createOrdersTableSql = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    userId INT UNSIGNED NOT NULL,
    trackingId VARCHAR(40) NOT NULL,
    items JSON NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    paymentStatus ENUM('paid', 'pending', 'failed') NOT NULL DEFAULT 'paid',
    status ENUM('placed', 'preparing', 'on_the_way', 'delivered') NOT NULL DEFAULT 'placed',
    deliveryAddress VARCHAR(255) NOT NULL,
    city VARCHAR(120) NOT NULL,
    estimatedDeliveryMinutes INT NOT NULL DEFAULT 35,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_tracking_id (trackingId),
    KEY idx_orders_user_id (userId),
    CONSTRAINT fk_orders_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

export const initializeDatabase = async () => {
  const bootstrapConnection = await mysql.createConnection({
    host: baseConfig.host,
    port: baseConfig.port,
    user: baseConfig.user,
    password: baseConfig.password,
  });

  await bootstrapConnection.query(
    `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``
  );
  await bootstrapConnection.end();

  pool = mysql.createPool({
    ...baseConfig,
    database: MYSQL_DATABASE,
  });

  await pool.query(createUsersTableSql);

  try {
    await pool.query(
      "ALTER TABLE users ADD COLUMN profileImageUrl VARCHAR(512) DEFAULT NULL"
    );
  } catch (error) {
    if (error.code !== "ER_DUP_FIELDNAME") {
      throw error;
    }
  }

  await pool.query(createOrdersTableSql);

  const createSubscribersTableSql = `
    CREATE TABLE IF NOT EXISTS subscribers (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      email VARCHAR(191) NOT NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY unique_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  await pool.query(createSubscribersTableSql);
};

export const getPool = () => {
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }

  return pool;
};

export const query = (...args) => getPool().query(...args);