import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Task } from "./Task.js";
import sequelizePaginate from "sequelize-paginate";

export const Project = sequelize.define("projects", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
	},
	description: { type: DataTypes.STRING },
});

// sequelizePaginate.paginate(Project);

Project.hasMany(Task, {
	foreignKey: "project_id",
	sourceKey: "id",
});

Task.belongsTo(Project, {
	foreignKey: "project_id",
	sourceKey: "id",
});
