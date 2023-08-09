import { ClotheSizeUser } from "../../models/ClotheSizeUser.js";
import { Event } from "../../models/Event.js";
import { PersonalInfo } from "../../models/PersonalInfo.js";
import { Project } from "../../models/Project.js";
import { QueryBuilder, operatorTypes as ot } from "../queryBuilder.js";

const { string, date, identifier, boolean } = operatorTypes;

export const userQueryBuilder = new QueryBuilder({
  id: { ...identifier, id: "id" },
  name: { ...string, id: "name" },
  email: { ...string, id: "email" },
  active: { ...boolean, id: "active" },
  assosiations: {
    project: {
      model: Project,
      attributes: {
        name: { ...string, id: "project.name" },
        description: { ...string, id: "project.description" },
        createdAt: { ...date, id: "project.createdAt" },
      },
    },
    event: {
      model: Event,
      attributes: {
        id: { ...identifier, id: "event.id" },
        name: { ...string, id: "event.name" },
        start_date: { ...date, id: "event.start_date" },
        end_date: { ...date, id: "event.end_date" },
      },
    },

    clothe_size: {
      model: ClotheSizeUser,
      attributes: {
        shirt: { ...string, id: "clothe_size.shirt" },
        pants: { ...string, id: "clothe_size.pants" },
        jacket: { ...string, id: "clothe_size.jacket" },
        shoes: { ...string, id: "clothe_size.shoes" },
      },
    },
    personal_info: {
      model: PersonalInfo,
      attributes: {
        identification_number: {
          ...string,
          id: "personal_info.identification_number",
        },
        passport_number: { ...string, id: "personal_info.passport_number" },
        passport_issuance_date: {
          ...date,
          id: "personal_info.passport_issuance_date",
        },
        passport_expiration_date: {
          ...date,
          id: "personal_info.passport_expiration_date",
        },
        birthdate: { ...date, id: "personal_info.birthdate" },
      },
    },
  },
});
