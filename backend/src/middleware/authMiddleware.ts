import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const authHeader = req.headers.authorization ?? '';
  if(!authHeader) {
    return res.status(401).json({
      error: 'authorization header is missing'
    });
  }

  const token = authHeader.split(' ')[1];
  if(!token) {
    return res.status(401).json({
      error: 'token is missing'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded: ", decoded);
    req.body.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'invalid token'
    });
  }
}