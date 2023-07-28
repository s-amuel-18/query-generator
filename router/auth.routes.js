import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { check } from "express-validator";
import { validateFields } from "../middleware/validateFields.js";
import { userEmailExist } from "../helpers/dbUserValidator.js";
import {
	loginController,
	signInWithGoogle,
} from "../controllers/auth.controller.js";

const router = Router();

router.post(
	"/login",
	[
		check("email", "El email es invalido").isEmail(),
		check("email").custom((email) => userEmailExist(email, true)),
		check("password", "La contraseña es obligatoria.").not().isEmpty(),
		validateFields,
	],
	loginController,
);

router.post(
	"/google-login",
	[
		check("google_id", "El google id es obligatorio").not().isEmpty(),
		validateFields,
	],
	signInWithGoogle,
);

export default router;
