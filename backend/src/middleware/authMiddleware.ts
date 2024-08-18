import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/environment";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authToken = req.cookies?.auth_token;
  if(!authToken) {
    return res.status(401).json({
      error: 'token is missing'
    });
  }

  try {
    if(req.isAuthenticated()) {
      const decoded = jwt.verify(authToken, JWT_SECRET);
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