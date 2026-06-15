const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sre_app',
  });

  const passwordHash = await bcrypt.hash('helfy', 10);

  await connection.query(
    `INSERT IGNORE INTO users (username, email, password_hash)
     VALUES ('ilay', 'ilay@example.com', ?)`,
    [passwordHash]
  );

  console.log('Default user created: ilay / helfy');
  await connection.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
