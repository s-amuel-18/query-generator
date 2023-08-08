import { checkSchema } from "express-validator";
import { userQueryBuilder } from "../../helpers/queryBuiler/User.queryBuilder.js";

const fieldBaseObj = {
  isObject: true,
  optional: true,
};

export const userQueryBuilderValidation = {
  // id: fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation("id", "id."),

  // name: fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation("name", "name."),

  // email: fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation("email", "email."),

  // active: fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation("active", "active."),

  // project: fieldBaseObj,
  // "project.name": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "name",
    "project.name.",
    "project"
  ),
  // "project.description": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "description",
    "project.description.",
    "project"
  ),

  // event: fieldBaseObj,
  // "event.id": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation("id", "event.id.", "event"),
  // "event.name": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation("name", "event.name.", "event"),
  // "event.start_date": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "start_date",
    "event.start_date.",
    "event"
  ),
  // "event.end_date": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "end_date",
    "event.end_date.",
    "event"
  ),

  // clothe_size: fieldBaseObj,
  // "clothe_size.shirt": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "shirt",
    "clothe_size.shirt.",
    "clothe_size"
  ),
  // "clothe_size.pants": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "pants",
    "clothe_size.pants.",
    "clothe_size"
  ),
  // "clothe_size.jacket": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "jacket",
    "clothe_size.jacket.",
    "clothe_size"
  ),
  // "clothe_size.shoes": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "shoes",
    "clothe_size.shoes.",
    "clothe_size"
  ),

  // personal_info: fieldBaseObj,
  // "personal_info.identification_number": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "identification_number",
    "personal_info.identification_number.",
    "personal_info"
  ),
  // "personal_info.passport_number": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "passport_number",
    "personal_info.passport_number.",
    "personal_info"
  ),
  // "personal_info.passport_issuance_date": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "passport_issuance_date",
    "personal_info.passport_issuance_date.",
    "personal_info"
  ),
  // "personal_info.passport_expiration_date": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "passport_expiration_date",
    "personal_info.passport_expiration_date.",
    "personal_info"
  ),
  // "personal_info.birthdate": fieldBaseObj,
  ...userQueryBuilder.createObjFieldValidation(
    "birthdate",
    "personal_info.birthdate.",
    "personal_info"
  ),
};
