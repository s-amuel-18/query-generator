import { Router } from "express";
import {
	createProject,
	deleteProject,
	getProjects,
	showProject,
	updateProject,
} from "../controllers/project.controller.js";
import { check, query } from "express-validator";
import { existProject } from "../helpers/projectValidation.js";
import { validateFields } from "../middleware/validateFields.js";
import { authenticated } from "../middleware/authenticated.js";
const router = Router();

router.get(
	"/projects",
	[
		// authenticated,
		query("page")
			.optional()
			.isNumeric()
			.withMessage("La página a buscar debe ser un número")
			.bail()
			.customSanitizer((value) => parseInt(value)),
		// validateFields,
	],
	getProjects,
);
router.post(
	"/project/create",
	[
		authenticated,
		check("name", "El nombre es obligatorio.").not().isEmpty(),
		check("description", "La descripcion es obligatoria.").not().isEmpty(),
		validateFields,
	],
	createProject,
);

router.put(
	"/project/:id",
	[check("id").custom(existProject), validateFields],
	updateProject,
);
router.delete("/project/:id", deleteProject);
router.get("/project/:id", showProject);

export default router;
