import { Request, Response, NextFunction } from "express";
import { EventLogError, NotFoundError } from "../domain";
import { validationResult } from "express-validator";
import morgan from "morgan";

export const errorMiddleware = (
  error: EventLogError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof NotFoundError) {
    res.status(404).json({
      message: error.message,
    });
    return;
  }

  res.status(500).json({ error: "Internal Server Error" });
};

export const validationErrorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    res.status(400).json({ code: "Validation Failed", data: errors.array() });
  }
};

export const loggerMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms');
