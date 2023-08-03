import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Project } from "./Project.js";

export const Task = sequelize.define("tasks", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
	},
	done: { type: DataTypes.BOOLEAN },
});