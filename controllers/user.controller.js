import { validationResult } from "express-validator";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import {
	dataParserRelations,
	dataToFilter,
	objUserDataToFilter,
	objUserRelationship,
} from "../helpers/dataTransferParser.js";
import { Event } from "../models/Event.js";
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
	const objQuery = dataToFilter(req.query, objUserDataToFilter);
	console.log("objQuery", objQuery);
	/*
	 * se deben aplicar operadores logicos, se recomienda crear un objeto base que contengan todos los operadores logicos, en base a estos operadores se podran hacer los filtros correctamente
	 */
	// const users = await User.findAndCountAll({
	// 	include: [
	// 		{
	// 			model: Project
	// 		}
	// 	]
	// });
	const users = await User.findAndCountAll({ ...objQuery });
	// const users = await User.findAndCountAll({
	// 	include: [
	// 		{
	// 			model: Event,
	// 			where: { start_date: "2018-06-04" },
	// 			required: false,
	// 		},
	// 	],
	// });

	return res.json({ users });
};

export const createUser = async (req, res) => {
	const { name, email, password } = req.body;

	// * Encriptar la contraseña
	const salt = bcryptjs.genSaltSync();
	const passwordHash = bcryptjs.hashSync(password, salt);

	try {
		const user = await User.create({ name, email, password: passwordHash });
		return res.json({ user });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

export const updateProject = async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	// return res.send("ACTU");
	try {
		const project = await Project.findOne({
			where: {
				id,
			},
		});

		project.set(body);
		await project.save();

		return res.json({
			project,
			message: "El proyecto se actualizó correctamente.",
		});
	} catch (error) {
		return res.json({ message: error.message });
	}
};

export const deleteProject = async (req, res) => {
	const { id } = req.params;
	console.log(id);
	try {
		const project = await Project.findOne({ where: { id } });

		if (!project)
			return res.status(404).json({
				message: "El proyecto no fue encontrado.",
			});

		await project.destroy();

		return res.json({
			message: `El proyecto ${project.name} se ha eliminado correcatamente.`,
		});
	} catch (error) {
		return res.json({ message: error.message });
	}
};
export const showProject = async (req, res) => {};
