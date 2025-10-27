import config from "@/config"
import { NextFunction, Request, Response } from "express"

import AppError from "./AppError"
import logger from "./logger"

const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err)
  res.status(500).json({
    error:
      config.nodeEnv === "development"
        ? err.message
        : err.isOperational
          ? err.message
          : "Something went wrong. Please try again.",
  })

  next()
}

export default errorHandler
