import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const connectionString = "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME;
const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

async function seedUser() {
  console.log('Seeding admin user...');
  
  const password = 'Admin@123';
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  try {
    const res = await pool.query(
      "INSERT INTO users (email, password_hash, role, full_name) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password_hash = $2",
      ['admin@phuchung.com.vn', password_hash, 'SUPER_ADMIN', 'Quản trị viên Hệ thống']
    );
    console.log('Admin user seeded/updated successfully! email: admin@phuchung.com.vn / pass: Admin@123');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

seedUser();
