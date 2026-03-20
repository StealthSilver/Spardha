import { Router } from "express";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/users", userRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
