import { query } from "express-validator";
import { Op } from "sequelize";

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
      isString: true,
      errorMessage: "",
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
      isNumeric: true,
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
      isDate: true,
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
      isNumeric: true,
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
    Object.keys(paramsToFilter)
      .filter(
        (fieldToFilter) =>
          Object.hasOwnProperty.call(fieldsWithOperators, fieldToFilter) &&
          fieldToFilter != "assosiations"
      )
      .forEach((fieldToFilter) => {
        const type = fieldsWithOperators[fieldToFilter];
        const fieldType = type.operators;

        const operatorsWithFilterValue = paramsToFilter[fieldToFilter];

        const arrquery = Object.keys(operatorsWithFilterValue)
          .filter((operator) => Object.hasOwnProperty.call(fieldType, operator))
          .map((operator) => {
            const valueOperator = operatorsWithFilterValue[operator];
            const operatorFn = fieldType[operator];

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

    const arrModelIncludes = Object.keys(queryParams)
      .filter((param) => Object.hasOwnProperty.call(objRelations, param))
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
    return this.createObjectValidation(this.modelFields, "expressValidation");
  }

  createObjectValidation(obj, attr) {
    if (typeof obj !== "object") return {};

    let acumulado = {};

    for (const [clave, valor] of Object.entries(obj)) {
      if (
        Object.hasOwnProperty.call(obj, attr) &&
        Object.hasOwnProperty.call(obj, "id") &&
        Object.hasOwnProperty.call(obj, "operators")
      ) {
        Object.keys(obj.operators).forEach((operator) => {
          acumulado[`${obj.id}.${operator}`] = obj[attr];
        });
        break;
      }

      acumulado = {
        ...acumulado,
        ...this.createObjectValidation(valor, attr),
      };
    }

    return acumulado;
  }
}
