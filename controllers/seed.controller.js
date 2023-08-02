import { faker } from "@faker-js/faker";
import {
  createRandomCholtesSize,
  createRandomEvent,
  createRandomPersonalInfo,
  createRandomProjects,
  createRandomTask,
  createRandomUser,
} from "../helpers/faker/projects.faker.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { PersonalInfo } from "../models/PersonalInfo.js";
import { Sequelize } from "sequelize";
import { sequelize } from "../database/database.js";
import { ClotheSizeUser } from "../models/ClotheSizeUser.js";
import { Event } from "../models/Event.js";

export const generateDataFake = async (req, res) => {
  const users = faker.helpers.multiple(createRandomUser, { count: 5 });
  const personalInfo = faker.helpers.multiple(createRandomPersonalInfo, {
    count: 5,
  });

  const sizeClothes = faker.helpers.multiple(createRandomCholtesSize, {
    count: 5,
  });

  users.forEach(async (user) => {
    try {
      const newUser = await User.create({ ...user });

      const newEvent = await Event.create({ ...createRandomEvent() });
      await newUser.addEvent(newEvent);

      const projects = faker.helpers.multiple(createRandomProjects, {
        count: 5,
      });

      for (const project of projects) {
        const ramdomUser = await User.findOne({
          order: sequelize.random(),
        });
        try {
          await Project.create({
            ...project,
            user_id: ramdomUser.id,
          });
        } catch (error) {
          console.log(error.message);
        }
      }

      try {
        await PersonalInfo.create({
          ...createRandomPersonalInfo(),
          user_id: newUser.id,
        });
      } catch (error) {
        console.log(error.message);
      }

      try {
        await ClotheSizeUser.create({
          ...createRandomCholtesSize(),
          user_id: newUser.id,
        });
      } catch (error) {
        console.log(error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  });

  return res.json({ message: "Generando data." });
};
