import { Router } from "express";
import { upload } from "../controllers/upload.controller.js";

const router = Router();

router.post("/", [], upload);

export default router;
