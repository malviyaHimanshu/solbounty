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
    if(req.isAuthenticated()) {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("decoded: ", decoded);
      req.body.user = decoded;
      next();
    } else {
      throw new Error('unauthorized user');
    }
  } catch (error) {
    return res.status(401).json({
      error: 'unauthorized user'
    });
  }
}

export function gitAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if(req.isAuthenticated()) {
      console.log("you are authenticated user: ", req.user);
      return next();
    } else {
      throw new Error('unauthorized user');
    }
  } catch (error: any) {
    return res.status(401).json({
      error: error.message ? error.message : 'unauthorized user'
    });
  }
}