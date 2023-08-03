import { Sequelize } from "sequelize";

const { DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  port: DB_PORT,
});
