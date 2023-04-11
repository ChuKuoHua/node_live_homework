import { NextFunction } from 'express';
import { IError } from "../models/error";

const appError = (httpStatus:number, errorMessage: string, next: NextFunction) => {
  const error: IError = new Error(errorMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
}

module.exports = appError