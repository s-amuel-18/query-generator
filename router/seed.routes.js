import { Router } from "express";
import { generateDataFake } from "../controllers/seed.controller.js";

const router = Router();
router.get("/data-fake-generate", generateDataFake);

export default router;
