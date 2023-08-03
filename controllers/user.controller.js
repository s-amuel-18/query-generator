import { validationResult } from "express-validator";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import bcryptjs from "bcryptjs";
import {
  dataToFilter,
  objUserDataToFilter,
} from "../helpers/dataTransferParser.js";
import { Event } from "../models/Event.js";
import { Op, Sequelize } from "sequelize";
import { ClotheSizeUser } from "../models/ClotheSizeUser.js";
import { QueryBuilder } from "../helpers/queryBuilder.js";
import { userQueryBuilder } from "../helpers/queryBuiler/User.queryBuilder.js";

export const getUsers = async (req, res) => {
  const querySelquelize = userQueryBuilder.transformRequestIntoQuery(req.query);

  const users = await User.findAndCountAll({
    ...querySelquelize,
    distinct: true,
  });
  // const users = await User.findAll({
  //   include: [{ model: Project, attributes: ["id"] }],
  // });

  return res.json({
    users,
  });
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // * Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  const passwordHash = bcryptjs.hashSync(password, salt);

  try {
    const user = await User.create({ name, email, password: passwordHash });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const project = await Project.findOne({
      where: {
        id,
      },
    });

    project.set(body);
    await project.save();

    return res.json({
      project,
      message: "El proyecto se actualizó correctamente.",
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findOne({ where: { id } });

    if (!project)
      return res.status(404).json({
        message: "El proyecto no fue encontrado.",
      });

    await project.destroy();

    return res.json({
      message: `El proyecto ${project.name} se ha eliminado correcatamente.`,
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
export const showProject = async (req, res) => {};
