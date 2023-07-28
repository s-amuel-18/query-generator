import { validationResult } from "express-validator";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import { Op } from "sequelize";
import { sequelize } from "../database/database.js";
import {
	createRandomProjects,
	createRandomTask,
	createRandomUser,
} from "../helpers/faker/projects.faker.js";
import { faker } from "@faker-js/faker";
import { Task } from "../models/Task.js";
// import { dataParser } from "../helpers/dataTransferParser.js";
import moment from "moment/moment.js";

export const getProjects = async (req, res) => {
	const project = createRandomProjects();

	const { page = 1, limit = 5 } = req.query;

	// const objQuery = dataParser(req.query);
	// console.log(objQuery[0].where);

	// return res.json("dsadsa");
	const offset = page <= 1 ? 0 : (page - 1) * limit;
	try {
		// console.log(objQuery);
		// const projects = await User.findAll({
		// 	include: [
		// 		{
		// 			model: Project,
		// 			where: {
		// 				[Op.and]: [
		// 					{
		// 						createdAt: {
		// 							[Op.lt]: moment("2022-07-26").format(),
		// 						},
		// 					},
		// 				],
		// 			},
		// 		},
		// 	],
		// });
		const projects = await User.findAll({ include: objQuery });
		// const projects = await User.findAll({
		// 	where: {
		// 		[Op.and]: [
		// 			{ createdAt: { [Op.gt]: moment("2024-01-01").format() } },
		// 			// { createdAt: { [Op.lt]: moment("2022-08-10").format() } },
		// 		],
		// 	},
		// });

		return res.json({ projects });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
export const createProject = async (req, res) => {
	const { name, description } = req.body;
	const authUser = req.user;
	try {
		const newProject = await Project.create({
			name,
			description,
			user_id: authUser.id,
		});
		return res.json({ project: newProject });
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
