import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
})

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function connect() {
  const client = await pool.connect()
  console.log('Connected to the database')
  client.release()
}

export default pool