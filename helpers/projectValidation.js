import { Project } from "../models/Project.js";

export const existProject = async (id) => {
  const project = await Project.findOne({
    where: {
      id,
    },
  });
  console.log(project);
  if (!project) throw new Error("El proyecto no fue encontrado.");
};
