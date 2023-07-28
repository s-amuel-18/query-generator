import { User } from "../models/User.js";

export const userEmailExist = async (email, exist = false) => {
	const existEmail = await User.findOne({ where: { email } });

	if (exist) {
		if (!existEmail)
			throw new Error("El email no se encuentra registrado.");

		return null;
	}
	if (existEmail) throw new Error("El email ya se encuentra registrado.");
};
