import { Op } from "sequelize";
import v from "validator";

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

const notIsEmpty = (value) => typeof value === "string" && !v.isEmpty(value);

const arrStringValidation = [notIsEmpty];
const arrNumberValidation = [notIsEmpty, v.isNumeric];
const arrDateValidation = [notIsEmpty, v.isISO8601];

export const operatorTypes = {
  string: {
    validation: arrStringValidation,
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
    validation: arrNumberValidation,
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
    validation: arrDateValidation,
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
    validation: arrDateValidation,
    operators: {
      is,
    },
  },
  boolean: {
    validation: [],
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

            type.validation.forEach((isAFiledValue) => {
              if (!isAFiledValue(valueOperator))
                throw new Error(`El campo ${fieldToFilter} es invalido.`);
            });

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
}
