import { Op } from "sequelize";
import { Project } from "../models/Project.js";
import { Event } from "../models/Event.js";
import { ClotheSizeUser } from "../models/ClotheSizeUser.js";

//
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
};

export const objUserRelationship = {
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
};

export const objUserDataToFilter = {
	id: (value) => ({ id: value }),
	name: (value) => ({ name: { [Op.like]: `%${value}%` } }),
	email: (value) => ({ email: { [Op.like]: `%${value}%` } }),
	active: (value) => ({ active: value }),
	assosiations: { ...objUserRelationship },
};

export const dataParserRelations = (queryParams, objRelations) => {
	if (!queryParams || !objRelations)
		throw new Error(
			"Error, se deben pasar  los parametros obligatoriamente en la funcion 'dataParserRelations'",
		);

	const arrModelIncludes = [];
	const reqParamsKeys = Object.keys(queryParams);

	reqParamsKeys.forEach((param) => {
		if (!Object.hasOwnProperty.call(objRelations, param)) return null;

		const fieldsToFilter = queryParams[param];
		const fieldsToFilterKeys = Object.keys(fieldsToFilter);
		const relationship = objRelations[param];
		const relationshipAttr = relationship.attributes;

		const whereForRelation = {
			model: relationship.model,
			where: {},
		};

		fieldsToFilterKeys.forEach((fieldToFilter) => {
			if (!Object.hasOwnProperty.call(relationshipAttr, fieldToFilter))
				return null;

			const fieldRelationshipType = relationshipAttr[fieldToFilter];
			const operatorsWithFilterValue = fieldsToFilter[fieldToFilter];

			// todo: Se debe renombrar esta variable de forma que sea mas explisita.
			const arrquery = Object.keys(operatorsWithFilterValue)
				.filter((operator) =>
					Object.hasOwnProperty.call(fieldRelationshipType, operator),
				)
				.map((operator) => {
					const valueOperator = operatorsWithFilterValue[operator];
					const fnToOperator = fieldRelationshipType[operator];
					return fnToOperator(valueOperator);
				});

			if (arrquery.length === 0) return null;

			whereForRelation.where = {
				...whereForRelation.where,
				[fieldToFilter]: { [Op.and]: arrquery },
			};
		});

		arrModelIncludes.push(whereForRelation);
	});

	return arrModelIncludes;
};

export const dataToFilter = (
	queryParams = null,
	objConfigDataFilter = null,
	// prefix = null,
) => {
	if (!queryParams || !objConfigDataFilter)
		throw new Error(
			"Error, se deben pasar  los parametros obligatoriamente en la funcion 'dataToFilter'",
		);

	const rndQuery = {
		where: {},
		include: [...dataParserRelations(queryParams, objUserRelationship)],
	};

	Object.keys(queryParams).forEach((param) => {
		if (
			param === "assosiations" ||
			!Object.hasOwnProperty.call(objConfigDataFilter, param)
		)
			return null;

		const valueParan = queryParams[param];
		const functionFilterParam = objConfigDataFilter[param];
		rndQuery.where = {
			...rndQuery.where,
			...functionFilterParam(valueParan),
		};
	});
	return rndQuery;
};
