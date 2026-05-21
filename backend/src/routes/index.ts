import { Router } from "express";
import projectRoutes from "./projectRoutes";
import contactRoutes from "./contactRoutes";
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";

const router = Router();

router.use("/projects", projectRoutes);
router.use("/contact", contactRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

export default router;
