import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Event = sequelize.define("events", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	start_date: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
	end_date: {
		type: DataTypes.DATEONLY,
		allowNull: false,
	},
});
