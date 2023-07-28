import { request, response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticated = async (req = request, res = response, next) => {
	const authorization = req.header("Authorization");
	const msgNotAuth = "Usuario no autenticado.";

	if (!authorization) return res.status(401).json({ message: msgNotAuth });

	const token = authorization.split(" ")[1];

	try {
		const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const user = await User.findOne({ where: { id: uid } });

		if (!user) throw new Error("Usuario no encontrado");
		if (!user.active) throw new Error("Usuario invalido");

		req.user = user;

		next();
	} catch (error) {
		console.log(error);
		return res.status(401).json({ message: "Usuario invalido" });
	}

	// if (!token) return res.status(401).json({ message: msgNotAuth });

	// if (!token) console.log(token);
};
