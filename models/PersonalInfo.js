import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const PersonalInfo = sequelize.define("personal_info", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	identification_number: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	passport_number: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	passport_issuance_date: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	passport_expiration_date: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	birthdate: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});
