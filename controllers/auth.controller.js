import { googleVerify } from "../helpers/googleAuthVerify.js";
import { jwtGenerate } from "../helpers/jwtHelp.js";
import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";

export const loginController = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });

		if (!user.active)
			return res
				.status(400)
				.json({ message: "El usuario se encuentra desactivado." });

		const passwordValid = bcryptjs.compareSync(password, user.password);

		if (!passwordValid)
			return res
				.status(400)
				.json({ message: "La contrasela es invalida." });

		const token = await jwtGenerate(user.id);

		return res.json({ user, token });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ messahe: error.message });
	}
};

export const signInWithGoogle = async (req, res) => {
	const { google_id } = req.body;
	const resp = googleVerify(google_id);
	return res.json({ google_id });
};
