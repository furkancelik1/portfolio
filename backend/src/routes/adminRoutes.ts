import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import {
  getMessages,
  markMessageRead,
  deleteMessage,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/adminController";

const router = Router();

router.use(requireAuth);

router.get("/messages", getMessages);
router.patch("/messages/:id", markMessageRead);
router.delete("/messages/:id", deleteMessage);

router.post("/projects", createProject);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

export default router;
