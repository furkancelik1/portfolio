import { Router } from "express";
import projectRoutes from "./projectRoutes";
import contactRoutes from "./contactRoutes";

const router = Router();

router.use("/projects", projectRoutes);
router.use("/contact", contactRoutes);

export default router;
