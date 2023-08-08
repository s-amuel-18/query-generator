import { query } from "express-validator";
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

export const operatorTypes = {
  string: {
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

  createObjFieldValidation(field, paramSchema, assosiations = null) {
    const fieldType = assosiations
      ? this.modelFields?.assosiations?.[assosiations]?.attributes?.[field]
      : this.modelFields?.[field];

    if (!fieldType) return null;

    let objValidator = {};

    Object.keys(fieldType.operators).forEach((operator) => {
      objValidator = {
        ...objValidator,
        [paramSchema + operator]: fieldType.expressValidation,
      };
    });

    return objValidator;
  }

  expressValidationSchema() {
    console.log(
      "REPETIDOS",
      this.createObjectValidation(this.modelFields, "expressValidation")
    );
  }

  // createObjectValidation(objToTraverse) {
  //   if (typeof objToTraverse !== "object") {
  //     return {};
  //   }

  //   let objFinal = {};

  //   for (const [key, value] of Object.entries(objToTraverse)) {
  //     if (key === "expressValidation") {
  //       // console.log("Entroo");
  //       objFinal = {
  //         ...objFinal,
  //         [`Obje ${Object.keys(objFinal)}`]: value,
  //       };
  //     }

  //     console.log("Casí retorna", key);
  //     objFinal = { ...this.createObjectValidation(value) };
  //   }
  //   return objFinal;
  // }
  createObjectValidation(objeto, atributo, count = 1) {
    // Condición de parada
    if (typeof objeto !== "object") {
      return {};
    }

    let acumulado = {};

    for (const [clave, valor] of Object.entries(objeto)) {
      if (clave === atributo) {
        acumulado = {
          ...acumulado,
          [`Obj ${Object.keys(acumulado).length + 1}`]: valor,
        };
      }

      acumulado = {
        ...acumulado,
        ...this.createObjectValidation(valor, atributo, count + 1),
      };
    }

    return acumulado;
  }
}
function acumularValor(objeto, atributo) {
  // Condición de parada
  if (typeof objeto !== "object") {
    return 0;
  }
  // Crear una variable para guardar el valor acumulado
  let acumulado = 0;
  // Recorrer las propiedades del objeto
  for (const [clave, valor] of Object.entries(objeto)) {
    // Comparar si la clave es igual al atributo buscado
    if (clave === atributo) {
      // Sumar el valor al acumulado
      acumulado += valor;
    }
    // Llamada recursiva con el valor de la propiedad
    acumulado += acumularValor(valor, atributo);
  }
  // Retornar el valor acumulado
  return acumulado;
}

// // Crear un objeto vacío
// let objetoAcumulado = {};
// // Asignar una propiedad con el nombre del atributo y el valor de la función
// objetoAcumulado["atributo"] = acumularValor(objeto, "atributo");
// // Mostrar el objeto acumulado
// console.log(objetoAcumulado);
