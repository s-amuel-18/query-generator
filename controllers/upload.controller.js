import path from "path";
import { fileURLToPath } from "url";
import { __dirname } from "../utilities/variables.js";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "../helpers/uploadFile.js";

export const upload = async (req, res) => {
	const { files } = req;

	if (!files || Object.keys(files).length == 0 || !files.archivo)
		return res
			.status(400)
			.json({ message: "No se envió un archivo valido." });

	try {
		const fileName = await uploadFile(files.archivo);
		return res.json({ fileName });
	} catch (error) {
		return res.status(500).json({ message: error });
	}
};
