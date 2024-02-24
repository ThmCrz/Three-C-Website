import { NextFunction, Request, Response } from "express"
import { User } from "./routers/userModel"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
export const generateToken = (user: User) => {

  dotenv.config();

    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET || 'amacccapstoneprojectsystem',
      {
        expiresIn: '30d',
      }
    )
  }

  export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.slice(7, authorization.length);
      const decode = jwt.verify(token, process.env.JWT_SECRET || 'amacccapstoneprojectsystem');
      req.user = decode as {
        _id: string;
        name: string;
        email: string;
        isAdmin: boolean;
        token: string;
      };
      next();
    } else {
      res.status(401).send({ message: "No token available" });
    }
  }