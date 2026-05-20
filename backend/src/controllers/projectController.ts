import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("getProjects error:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error("getProjectById error:", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
}
