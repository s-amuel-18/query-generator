import { faker } from "@faker-js/faker";
import { User } from "../../models/User.js";

export function createRandomProjects() {
	return {
		name: faker.lorem.sentence(3),
		description: faker.lorem.sentence({ min: 10, max: 30 }),
		createdAt: faker.date.anytime(),
		updatedAt: faker.date.anytime(),
	};
}
export function createRandomUser() {
	return {
		name: faker.person.firstName(),
		email: faker.internet.email(),
		createdAt: faker.date.anytime(),
		updatedAt: faker.date.anytime(),
		password:
			"$2a$10$4qP.NK0CgMeUjcA.mg40be8gc9CcTjYphT4c95qc9tRwKaUyOpYtS",
	};
}

export function createRandomTask() {
	return {
		name: faker.lorem.sentence(5),
		done: faker.datatype.boolean(),
		createdAt: faker.date.anytime(),
		updatedAt: faker.date.anytime(),
	};
}

export function createRandomPersonalInfo() {
	return {
		identification_number: faker.datatype.bigInt({
			min: 10000000,
			max: 33000000,
		}),
		passport_number: faker.datatype.bigInt({
			min: 10000000,
			max: 33000000,
		}),
		passport_issuance_date: faker.date.between({
			from: "2010-01-01T00:00:00.000Z",
			to: "2018-01-01T00:00:00.000Z",
		}),
		passport_expiration_date: faker.date.between({
			from: "2018-01-01T00:00:00.000Z",
			to: "2024-01-01T00:00:00.000Z",
		}),
		birthdate: faker.date.between({
			from: "1990-01-01T00:00:00.000Z",
			to: "2003-01-01T00:00:00.000Z",
		}),
	};
}
export function createRandomEvent() {
	return {
		name: faker.lorem.sentence(5),
		start_date: faker.date.between({
			from: "2018-01-01T00:00:00.000Z",
			to: "2024-01-01T00:00:00.000Z",
		}),
		end_date: faker.date.between({
			from: "1990-01-01T00:00:00.000Z",
			to: "2003-01-01T00:00:00.000Z",
		}),
	};
}

export function createRandomCholtesSize() {
	const sizeClothes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];
	let startSize = 36;
	const shoesSizes = [1, 2, 3, 4, 5, 6, 7, 8].map((el, i) => {
		startSize += 2;
		return startSize;
	});

	return {
		shirt: sizeClothes[Math.floor(Math.random() * sizeClothes.length)],
		pants: sizeClothes[Math.floor(Math.random() * sizeClothes.length)],
		jacket: sizeClothes[Math.floor(Math.random() * sizeClothes.length)],
		shoes: shoesSizes[Math.floor(Math.random() * shoesSizes.length)],
	};
}
