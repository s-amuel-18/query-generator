import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const ClotheSizeUser = sequelize.define("clothes_size_user", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	shirt: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	pants: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	jacket: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	shoes: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});
