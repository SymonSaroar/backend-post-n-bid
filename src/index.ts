import express from 'express'
import dotenv from 'dotenv'
import router from "./routes/router";
import cors from 'cors'
import path from 'path'
dotenv.config()

const expressApp = express()
const PORT = process.env.PORT || 3000
expressApp.use(express.json())
expressApp.use(cors())
expressApp.use('/api', router)
expressApp.use(express.static(path.join(__dirname, 'private')))
expressApp.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})
