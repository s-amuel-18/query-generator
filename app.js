import express from "express";
import "dotenv/config";
import { sequelize } from "./database/database.js";
import "./models/User.js";
import routerProject from "./router/project.routes.js";
import routerUser from "./router/user.routes.js";
import routerAuth from "./router/auth.routes.js";
import routerUpload from "./router/upload.routes.js";
import routerSeed from "./router/seed.routes.js";
import {} from "./models/index.js";
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();
const main = async () => {
	app.use(cors());
	app.use(express.json());
	app.use(express.static("public"));

	app.use(
		fileUpload({
			useTempFiles: true,
			tempFileDir: "/tmp/",
			createParentPath: true,
		}),
	);

	app.use("/api", routerProject);
	app.use("/api", routerUser);
	app.use("/api/auth", routerAuth);
	app.use("/api/upload", routerUpload);
	app.use("/api/seed", routerSeed);

	try {
		await sequelize.sync({
			force: false /* * para eliminar las tablas en caso de que se hagan actualizaciones en los modelos */,
		});
		console.log("BD funcionando");
		app.listen(process.env.APP_PORT, () => {
			console.log("Corriendo en el puerto " + process.env.APP_PORT);
		});
	} catch (error) {
		console.error(error.message);
		throw new Error(error.message);
	}
};
main();
