import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Project } from "./Project.js";
import { PersonalInfo } from "./PersonalInfo.js";
import { ClotheSizeUser } from "./ClotheSizeUser.js";
import { Event } from "./Event.js";

export const User = sequelize.define("users", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		// field: "id",
	},
	name: {
		type: DataTypes.STRING,
		// field: "name_field",
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
	},
	active: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	},
	google: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

// * ======================================================
// * =================RELACIONES===========================
// * ======================================================
User.hasMany(Project, {
	foreignKey: "user_id",
	sourceKey: "id",
});
Project.belongsTo(User, {
	foreignKey: "user_id",
	sourceKey: "id",
});

User.hasMany(PersonalInfo, {
	foreignKey: "user_id",
	sourceKey: "id",
});
PersonalInfo.belongsTo(User, {
	foreignKey: "user_id",
	sourceKey: "id",
});

User.hasMany(ClotheSizeUser, {
	foreignKey: "user_id",
	sourceKey: "id",
});
ClotheSizeUser.belongsTo(User, {
	foreignKey: "user_id",
	sourceKey: "id",
});

User.belongsToMany(Event, { through: "user_event" });
Event.belongsToMany(User, { through: "user_event" });
