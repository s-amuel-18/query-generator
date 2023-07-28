import path from "path";
import { __dirname } from "../utilities/variables.js";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = (
	file,
	allowedExtentions = ["png", "jpg", "jpeg"],
	folder = ""
) =>
	new Promise((resolve, reject) => {
		const fileNameSplit = file.name.split(".");
		const fileExtention = fileNameSplit[fileNameSplit.length - 1];

		if (!allowedExtentions.includes(fileExtention))
			return reject("Extension del archivo no permitida.");

		const temporalName = uuidv4() + "." + fileExtention;
		const uploadFile = path.join(
			__dirname,
			"../uploads",
			folder,
			temporalName
		);

		file.mv(uploadFile, (err) => {
			if (err) return reject("Error del servidor.");

			return resolve(temporalName);
		});
	});
