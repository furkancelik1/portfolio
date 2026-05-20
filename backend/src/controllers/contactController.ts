import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { mailTransport, buildContactHtml } from "../config/mail";
import { env } from "../config/env";

export async function sendContactMessage(req: Request, res: Response) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: "name, email and message are required" });
      return;
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    if (mailTransport && env.EMAIL_USER) {
      mailTransport.sendMail({
        from: `"Portfolyo Formu" <${env.EMAIL_USER}>`,
        to: env.EMAIL_USER,
        subject: `[Portfolyo] Yeni İletişim Mesajı - From: ${name}`,
        html: buildContactHtml(name, email, message),
      }).catch((mailErr) => {
        console.error("Mail gönderme hatası (veritabanı kaydı başarılı):", mailErr);
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      id: contactMessage.id,
    });
  } catch (error) {
    console.error("sendContactMessage error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}
