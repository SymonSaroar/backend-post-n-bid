import mysql from "mysql"
import dotenv from 'dotenv'

dotenv.config()
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'bidder',
  password: '',
  database: 'database_test'
})

console.log(process.env.DB_HOST, process.env.DB_NAME)

connection.connect((e) => {
  if(e) console.error('error', e)
  console.log('connected')
})
export default connection