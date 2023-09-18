import mysql from "mysql"
import dotenv from 'dotenv'

dotenv.config()
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})

console.log(process.env.DB_HOST, process.env.DB_NAME)

connection.connect((e) => {
  if(e) console.error('error', e)
  console.log('connected')
})
export default connection