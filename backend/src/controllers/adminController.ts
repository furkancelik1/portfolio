import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middlewares/auth";

/* ── Contact Messages ─────────────────────────────────── */

export async function getMessages(_req: AuthRequest, res: Response) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}

export async function markMessageRead(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid message ID" });
      return;
    }

    const message = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
    res.json(message);
  } catch (error) {
    console.error("markMessageRead error:", error);
    res.status(500).json({ message: "Failed to update message" });
  }
}

export async function deleteMessage(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid message ID" });
      return;
    }

    await prisma.contactMessage.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("deleteMessage error:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
}

/* ── Projects CRUD ───────────────────────────────────── */

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, description, content, tags, imageUrl, githubUrl, liveUrl } =
      req.body;

    if (!title || !description || !content || !imageUrl) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        content,
        tags: tags || [],
        imageUrl,
        githubUrl,
        liveUrl,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
}

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const { title, description, content, tags, imageUrl, githubUrl, liveUrl } =
      req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(tags !== undefined && { tags }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
      },
    });
    res.json(project);
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: "Failed to update project" });
  }
}

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("deleteProject error:", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
}
