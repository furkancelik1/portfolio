import { Router } from "express";
import { sendContactMessage } from "../controllers/contactController";
import { validate } from "../middlewares/validate";
import { contactSchema } from "../schemas/contactSchema";

const router = Router();

router.post("/", validate(contactSchema), sendContactMessage);

export default router;
