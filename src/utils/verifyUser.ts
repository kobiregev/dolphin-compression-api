import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  const { challenge } = req.headers;
  
  if (challenge !== SECRET_KEY)
    return res.status(StatusCodes.UNAUTHORIZED).send("Better luck next time.");

  next();
}
