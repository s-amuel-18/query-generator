import { ClotheSizeUser } from "../../models/ClotheSizeUser.js";
import { Event } from "../../models/Event.js";
import { PersonalInfo } from "../../models/PersonalInfo.js";
import { Project } from "../../models/Project.js";
import {
  QueryBuilder,
  logicalOperators,
  operatorTypes,
} from "../queryBuilder.js";

export const userQueryBuilder = new QueryBuilder({
  id: operatorTypes.identifier,
  name: operatorTypes.string,
  email: operatorTypes.string,
  active: { is: logicalOperators.is },
  assosiations: {
    // * Modelos relacionados al modelo principal
    project: {
      model: Project, // * Obligatorio para la consulta
      attributes: {
        name: operatorTypes.string, // * Debe ser el mismo que se definió en el modelo
        description: operatorTypes.string,
        createdAt: operatorTypes.date,
      },
    },
    event: {
      model: Event,
      attributes: {
        id: operatorTypes.identifier,
        name: operatorTypes.string,
        start_date: operatorTypes.date,
        end_date: operatorTypes.date,
      },
    },
    clothe_size: {
      model: ClotheSizeUser,
      attributes: {
        shirt: operatorTypes.string,
        pants: operatorTypes.string,
        jacket: operatorTypes.string,
        shoes: operatorTypes.string,
      },
    },
    personal_info: {
      model: PersonalInfo,
      attributes: {
        identification_number: operatorTypes.string,
        passport_number: operatorTypes.string,
        passport_issuance_date: operatorTypes.string,
        passport_expiration_date: operatorTypes.string,
        birthdate: operatorTypes.string,
      },
    },
  },
});
