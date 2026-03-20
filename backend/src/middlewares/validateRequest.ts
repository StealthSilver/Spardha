import { Request, Response, NextFunction } from "express";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentType = req.headers["content-type"];
  
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(400).json({
        success: false,
        message: "Content-Type must be application/json",
      });
    }
  }
  
  next();
};
