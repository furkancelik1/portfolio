import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Bir iç sunucu hatası oluştu";

  res.status(statusCode).json({
    status: "error",
    message: env.NODE_ENV === "development" ? message : "Bir iç sunucu hatası oluştu",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
