import { ClotheSizeUser } from "../../models/ClotheSizeUser.js";
import { Event } from "../../models/Event.js";
import { PersonalInfo } from "../../models/PersonalInfo.js";
import { Project } from "../../models/Project.js";
import {
  QueryBuilder,
  logicalOperators,
  operatorTypes as ot,
} from "../queryBuilder.js";

export const userQueryBuilder = new QueryBuilder({
  id: ot.identifier,
  name: ot.string,
  email: ot.string,
  active: ot.boolean,
  assosiations: {
    // * Modelos relacionados al modelo principal
    project: {
      model: Project, // * Obligatorio para la consulta
      attributes: {
        name: ot.string, // * Debe ser el mismo que se definió en el modelo
        description: ot.string,
        createdAt: ot.date,
      },
    },
    event: {
      model: Event,
      attributes: {
        id: ot.identifier,
        name: ot.string,
        start_date: ot.date,
        end_date: ot.date,
      },
    },

    clothe_size: {
      model: ClotheSizeUser,
      attributes: {
        shirt: ot.string,
        pants: ot.string,
        jacket: ot.string,
        shoes: ot.string,
      },
    },
    personal_info: {
      model: PersonalInfo,
      attributes: {
        identification_number: ot.string,
        passport_number: ot.string,
        passport_issuance_date: ot.date,
        passport_expiration_date: ot.date,
        birthdate: ot.date,
      },
    },
  },
});
