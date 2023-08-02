import { Op } from "sequelize";
import { Project } from "../models/Project.js";
import { Event } from "../models/Event.js";
import { ClotheSizeUser } from "../models/ClotheSizeUser.js";
import { PersonalInfo } from "../models/PersonalInfo.js";
import { response } from "express";

const logicalOperators = {
  contains: (value) => ({ [Op.like]: `%${value}%` }),
  not_contains: (value) => ({ [Op.notLike]: `%${value}%` }),
  is: (value) => ({ [Op.eq]: value }),
  is_not: (value) => ({ [Op.ne]: value }),
  begins_with: (value) => ({ [Op.like]: `${value}%` }),
  ends_with: (value) => ({ [Op.like]: `%${value}` }),
  more_than: (value) => ({ [Op.gt]: value }),
  less_than: (value) => ({ [Op.lt]: value }),
  more_than_or_equal: (value) => ({ [Op.gte]: value }),
  less_than_or_equal: (value) => ({ [Op.lte]: value }),
};

const {
  contains,
  not_contains,
  is,
  is_not,
  begins_with,
  ends_with,
  more_than,
  less_than,
  more_than_or_equal,
  less_than_or_equal,
} = logicalOperators;

const operatorTypes = {
  string: {
    begins_with,
    contains,
    ends_with,
    is,
    is_not,
    not_contains,
  },
  number: {
    is,
    is_not,
    less_than,
    less_than_or_equal,
    more_than,
    more_than_or_equal,
  },
  date: {
    is,
    is_not,
    less_than,
    less_than_or_equal,
    more_than,
    more_than_or_equal,
  },
  identifier: {
    is,
  },
  boolean: {
    is,
  },
};

/*
 * Objeto de configuración de la tabla base a consultar (User)
 * El objeto debe contener los mismos campos que fueron definidos en la instancia del modelo, junto con el tipo de dato.
 * assosiations: En caso de que el modelo a consultar tenga relaciones con otros modelos estos se colocaran en un campo llamado asosiatios.
 */
export const objUserDataToFilter = {
  id: operatorTypes.identifier,
  name: operatorTypes.string,
  email: operatorTypes.string,
  active: { is },
  /*
   * Objeto de relaciones, este objeto contiene las relaciones de la tabla a consultar, en este caso Users.
   * Para que el query builder funcione correctamente se deben pasar como primera llave el nombre de la relacion Su contenido debe mantener la estructura planteada. ejem:
   * { RELATION: { model: {...}, attributes: {...} } }
   * model: Debe contener la instacia del modelo relacionado.
   * attribute: Debe contener los nombres de los campos de la tabla relacionada, IMPORTANTE: los campos deben ser los mismos que fueron definidos en el modelo. A cada campo se le debe asignar un tipo de dato que se optiene del objeto ``operatorTypes`` de esta forma le podemos asegurar una correcta busqueda a la hora de hacer la consulta, tambien limitamos al cliente que no puede pasar cualquier operador logico, unicamente los que estan definidos en el "tipo de operador".
   */
  assosiations: {
    project: {
      model: Project,
      attributes: {
        name: operatorTypes.string,
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
};

const fromParamsWithOperatorsToQuery = (paramsToFilter, assosiationFields) => {
  let queryWithOperators = {};
  Object.keys(paramsToFilter)
    .filter((fieldToFilter) =>
      Object.hasOwnProperty.call(assosiationFields, fieldToFilter)
    )
    .forEach((fieldToFilter) => {
      const fieldType = assosiationFields[fieldToFilter];
      const operatorsWithFilterValue = paramsToFilter[fieldToFilter];

      // todo: Se debe renombrar esta variable de forma que sea mas explisita.
      const arrquery = Object.keys(operatorsWithFilterValue)
        .filter((operator) => Object.hasOwnProperty.call(fieldType, operator))
        .map((operator) => {
          const valueOperator = operatorsWithFilterValue[operator];
          const fnToOperator = fieldType[operator];
          return fnToOperator(valueOperator);
        });

      if (arrquery.length === 0) return null;

      queryWithOperators = {
        ...queryWithOperators,
        [fieldToFilter]: { [Op.and]: arrquery },
      };
    });
  return queryWithOperators;
};

// * Retorna un objeto de consulta a los modelos relacionados con el modelo principal.
export const parserAssosiations = (queryParams = null, objRelations = null) => {
  if (!queryParams || !objRelations)
    throw new Error(
      "Error, se deben pasar  los parametros obligatoriamente en la funcion 'parserAssosiations'"
    );

  const arrModelIncludes = Object.keys(queryParams)
    .filter((param) => Object.hasOwnProperty.call(objRelations, param))
    .map((param) => {
      const fieldsToFilter = queryParams[param];
      const assosiation = objRelations[param];
      const assosiationAttr = assosiation.attributes;

      const queryParamOperator = fromParamsWithOperatorsToQuery(
        fieldsToFilter,
        assosiationAttr
      );

      return {
        model: assosiation.model,
        where: queryParamOperator,
      };
    });

  return arrModelIncludes;
};

export const dataToFilter = (
  queryParams = null,
  objConfigDataFilter = null
) => {
  if (!queryParams || !objConfigDataFilter)
    throw new Error(
      "Error, se deben pasar  los parametros obligatoriamente en la funcion 'dataToFilter'"
    );

  const finalQuery = {
    where: fromParamsWithOperatorsToQuery(queryParams, objConfigDataFilter),
    include: parserAssosiations(
      queryParams,
      objConfigDataFilter?.assosiations || {}
    ),
  };

  return finalQuery;
};
