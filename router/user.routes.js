import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { check, checkSchema, query } from "express-validator";
import { validateFields } from "../middleware/validateFields.js";
import { userEmailExist } from "../helpers/dbUserValidator.js";

import { userQueryBuilder } from "../helpers/queryBuiler/User.queryBuilder.js";

const router = Router();
const userValidationQB = userQueryBuilder.expressValidationSchema();

router.get(
  "/users",
  [checkSchema({ ...userValidationQB }), validateFields],
  // [
  //   checkSchema({ date: { trim: true, isNumeric: true, toInt: true } }),
  //   validateFields,
  // ],
  getUsers
);
router.post(
  "/user/create",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es invalido").isEmail(),
    check("email").custom((email) => userEmailExist(email)),
    check(
      "password",
      "La contraseña es invalidad, debe contener 6 caracteres como minimo"
    ).isLength({ min: 6 }),
    validateFields,
  ],
  createUser
);

export default router;
