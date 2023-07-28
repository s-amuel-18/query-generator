import jwt from "jsonwebtoken";

export const jwtGenerate = (uid) =>
	new Promise((resolve, reject) => {
		const payload = { uid };
		jwt.sign(
			payload,
			process.env.JWT_SECRET_KEY,
			{
				expiresIn: "5h",
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject("No se generó el token");
				} else {
					resolve(token);
				}
			}
		);
	});
