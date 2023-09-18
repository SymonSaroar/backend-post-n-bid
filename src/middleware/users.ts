import {Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface UserReq extends Request {
  userData?: any
}
export const mValidate = (req: UserReq, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*")
    if(!req.body.username || req.body.username.length < 3) {
      return res.status(400).send({message: 'Username Length should be greater than 2',})
    }
    if(!req.body.password || req.body.password.length < 6) {
      return res.status(400).send({message: 'Password length should be greater than 5'})
    }
    next()
  }
export const isLoggedIn = (req: UserReq, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*")
    if(!req.headers.authorization)
      return res.status(400).send({message: 'Invalid Session'})
    try {
      const header = req.headers.authorization
      const token = header.split(' ')[1]
      req.userData = jwt.verify(token, 'SECRETKEY')
      next()
    } catch(e) {
      return res.status(400).send({message: 'Session is not Valid'})
    }
  }

