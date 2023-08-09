import { query } from "express-validator";
import { Op } from "sequelize";
import validator from "validator";
import {
  isArray,
  isArrayOrString,
  isArrayOrNumber,
  isArrayOrDate,
  isArrayOrInt,
} from "../helpers/validation/funcion.validation.js";
import {
  hasPropertyCall,
  isObject,
  keys,
} from "./functions/object.function.js";

export const logicalOperators = {
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

export const operatorTypes = {
  string: {
    id: null,
    expressValidation: {
      trim: true,
      optional: true,
      custom: { options: isArrayOrString },
    },
    operators: {
      begins_with,
      contains,
      ends_with,
      is,
      is_not,
      not_contains,
    },
  },
  number: {
    id: null,
    expressValidation: {
      trim: true,
      optional: true,
      custom: { options: isArrayOrNumber },
      toInt: true,
      errorMessage: "",
    },
    operators: {
      is,
      is_not,
      less_than,
      less_than_or_equal,
      more_than,
      more_than_or_equal,
    },
  },
  date: {
    id: null,
    expressValidation: {
      trim: true,
      optional: true,
      custom: { options: isArrayOrDate },
      errorMessage: "",
    },
    operators: {
      is,
      is_not,
      less_than,
      less_than_or_equal,
      more_than,
      more_than_or_equal,
    },
  },
  identifier: {
    id: null,
    expressValidation: {
      trim: true,
      optional: true,
      custom: { options: isArrayOrInt },
      toInt: true,
      errorMessage: "",
    },
    operators: {
      is,
    },
  },
  boolean: {
    id: null,
    expressValidation: {
      trim: true,
      optional: true,
      isBoolean: true,
      toBoolean: true,
      errorMessage: "",
    },
    operators: {
      is,
    },
  },
};

export class QueryBuilder {
  constructor(modelFields) {
    this.modelFields = modelFields;
  }

  parserFieldsWithOperators = (paramsToFilter, fieldsWithOperators) => {
    let queryWithOperators = {};

    keys(paramsToFilter)
      .filter(
        (fieldToFilter) =>
          hasPropertyCall(fieldsWithOperators, fieldToFilter) &&
          fieldToFilter != "assosiations"
      )
      .forEach((fieldToFilter) => {
        const type = fieldsWithOperators[fieldToFilter];
        const fieldType = type.operators;

        const operatorsWithFilterValue = paramsToFilter[fieldToFilter];

        const arrquery = keys(operatorsWithFilterValue)
          .filter((operator) => hasPropertyCall(fieldType, operator))
          .map((operator) => {
            const valueOperator = operatorsWithFilterValue[operator];
            const operatorFn = fieldType[operator];

            if (isArray(valueOperator))
              return { [Op.or]: valueOperator.map((val) => operatorFn(val)) };

            return operatorFn(valueOperator);
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
  parserAssosiations = (queryParams) => {
    const objRelations = this.modelFields?.assosiations || {};

    const arrModelIncludes = keys(queryParams)
      .filter((param) => hasPropertyCall(objRelations, param))
      .map((param) => {
        const fieldsToFilter = queryParams[param];
        const assosiation = objRelations[param];
        const assosiationAttr = assosiation.attributes;

        const queryParamOperator = this.parserFieldsWithOperators(
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

  transformRequestIntoQuery = (queryParams = null) => {
    if (!queryParams)
      throw new Error(
        "Error, se deben pasar  los parametros obligatoriamente en la funcion 'dataToFilter'"
      );

    const finalQuery = {
      where: this.parserFieldsWithOperators(queryParams, this.modelFields),
      include: this.parserAssosiations(queryParams),
    };

    return finalQuery;
  };

  expressValidationSchema() {
    return this.createCheckSchemaObject(this.modelFields);
  }

  createCheckSchemaObject(obj) {
    if (!isObject(obj)) return {};

    let acumulado = {};
    const attr = "expressValidation";

    for (const [clave, valor] of Object.entries(obj)) {
      if (
        hasPropertyCall(obj, attr) &&
        hasPropertyCall(obj, "id") &&
        hasPropertyCall(obj, "operators")
      ) {
        keys(obj.operators).forEach((operator) => {
          acumulado[`${obj.id}.${operator}`] = obj[attr];
        });
        break;
      }

      acumulado = {
        ...acumulado,
        ...this.createCheckSchemaObject(valor, attr),
      };
    }

    return acumulado;
  }
}
