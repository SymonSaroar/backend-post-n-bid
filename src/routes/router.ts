import express, {NextFunction, Request, Response} from 'express'
import bcrypt from 'bcrypt'
import uuid from 'react-native-uuid'
import jwt from 'jsonwebtoken'
import db from '../database/database'
import { mValidate, isLoggedIn, UserReq } from '../middleware/users'
import { upload } from "../middleware/multer";

const router = express.Router()
router.post('/sign-up', mValidate, (req: UserReq, res: Response, next: NextFunction) => {
  console.log('in sign up')
  res.header("Access-Control-Allow-Origin", "*")
  db.query(
    `SELECT id FROM users WHERE LOWER(username) = LOWER(?);`,
    [req.body.username],
    (e, result) => {
      if(result && result.length)
        return res.status(409).send({message: 'Username Exists'})
      else
        bcrypt.hash(req.body.password, 11, (_e, hash) => {
          if(_e)
            return res.status(500).send({message: _e})
          else
            db.query(`INSERT INTO users (id, username, password, registered) VALUES (?, ?, ?, now());`,
              [uuid.v4(), req.body.username, hash],
              (__e, _result) => {
                if(__e) return res.status(400).send({message: __e})
                return res.status(201).send({message: 'Sign Up complete'})
              })
        })
    })
})

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  console.log('In Login')
  res.header("Access-Control-Allow-Origin", "*")
  db.query(
    `SELECT * FROM users WHERE username = ?;`,
    [req.body.username],
    (e, result) => {
      if(e) return res.status(400).send({message: e})
      if(!result.length) return res.status(400).send({message: 'Incorrect'})
      bcrypt.compare(req.body.password, result[0]['password'],
        (bE, bResult) => {
          if(bE) return res.status(400).send({message: 'Incorrect',})
          if(bResult){
            const token = jwt.sign({
              username: result[0].username,
              userId: result[0].id,
            }, 'SECRETKEY', {expiresIn: '3d'})
            db.query(`UPDATE users SET last_login = now() WHERE id = ?;`,
              [result[0].id,])
            return res.status(200).send({message: 'Logged In', token, user: result [0]})
          }
          return res.status(400).send({message: 'Incorrect',})
        })
    })
})

router.get('/private', isLoggedIn, (req: UserReq, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*")
  console.log(req.userData)
  res.send({userdata: req.userData})
})

router.post('/get-bids', isLoggedIn, (req: UserReq, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  const p:number = req.body.productNum + 1
  db.query(
    `SELECT username, price FROM bids WHERE price != 0 AND pid = ${p} ORDER BY timestamp DESC LIMIT 3;`,
    (e, result) => {
      if(e) return res.status(400).send({message: e})
      return res.status(200).send({data: result})
    }
  )
})

router.post('/get-max-bid', isLoggedIn, (req:UserReq, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  const p:number = req.body.productNum + 1
  db.query(
    `SELECT username, MAX(price) FROM bids WHERE pid = ${p}`,
    (e, result) => {
      if(e) return res.status(400).send({message: e})
      console.log('get-max-bid', result)
      return res.status(200).send({username: result[0].username, price: result[0]['MAX(price)']})
    }
  )
})

router.post('/bid', isLoggedIn, (req: UserReq, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  const p:number = req.body.productNum + 1
  const price:number = req.body.price
  db.query(
    `INSERT INTO bids (username, pid, price, timestamp) VALUES ('${req.userData.username}', ${p} ,${price}, now())`,
    (e, result)=>{
      if(e) return res.status(400).send({message: e})
      console.log(result)
      return res.status(200).send({message: 'updated database'})
    }
  )
})
router.get('/get-products', isLoggedIn, (req: UserReq, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  db.query(
    `SELECT id, name, image, owner FROM products`,
    (e, result) => {
      if(e) return res.status(400).send({message: e})
      console.log(result)
      return res.status(200).send({data: result})
    }
  )
})
router.post('/get-image', isLoggedIn, (req: UserReq, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  const imageId: number = req.body.productNum + 1
  db.query(
    `SELECT name, image, owner FROM products WHERE id = ?`,
    [imageId],
    (e, result) => {
      if(e) return res.status(400).send({message: e})
      console.log(result)
      return res.status(200).send({data: result[0]})
    }
  )
})
router.post('/upload-product', isLoggedIn, upload.single('image'), (req: UserReq, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  // console.log(req)
  const owner: string = req.userData.username
  const name: string = req.file?.originalname!
  const filename: string = req.file?.filename!
  db.query(
    `INSERT INTO products (name, image, owner) VALUES (?, ?, ?)`,
    [name, filename, owner],
    (e, result) => {
      if(e) return res.status(400).send({message: e})
      console.log(result)
      return res.status(200).send({message: 'Upload Complete'})
    }
  )
})
export default router