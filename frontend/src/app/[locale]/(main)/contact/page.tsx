import type { Metadata } from "next";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Furkan Çelik ile iletişime geçin — projeler, iş birliği veya herhangi bir konuda kozmik bir mesaj bırakın.",
  openGraph: {
    title: "İletişim | Furkan Çelik",
    description:
      "Furkan Çelik ile iletişime geçin — projeler, iş birliği veya herhangi bir konuda mesaj bırakın.",
  },
  twitter: {
    title: "İletişim | Furkan Çelik",
    description: "Furkan Çelik ile iletişime geçin.",
  },
};

export default function ContactPage() {
  return (
    <section className="relative z-30 flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
      <div className="w-full max-w-lg">
        <h1 className="text-center text-4xl font-bold text-white sm:text-5xl">İletişim</h1>
        <p className="mt-4 text-center text-white/50">
          Kozmik bir mesaj bırakın, en kısa sürede döneceğim.
        </p>
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
