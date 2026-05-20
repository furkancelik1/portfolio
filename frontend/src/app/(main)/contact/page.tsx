import ContactForm from "@/components/ui/ContactForm";

export default function ContactPage() {
  return (
    <section className="relative z-30 flex min-h-screen items-center justify-center px-6 pt-32 pb-20">
      {/* Gerçekçi Yatay Yıldız Kayması Katmanı */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div
          className="star-shooter absolute top-[20%] left-[-100px] w-[50px] h-[1px] bg-gradient-to-r from-indigo-500 to-transparent opacity-0 animate-shoot-l-to-r"
          style={{ animationDelay: "0s", animationDuration: "6s" }}
        />
        <div
          className="star-shooter absolute top-[45%] left-[-100px] w-[70px] h-[1px] bg-gradient-to-r from-purple-500 to-transparent opacity-0 animate-shoot-l-to-r"
          style={{ animationDelay: "2s", animationDuration: "7s" }}
        />
        <div
          className="star-shooter absolute top-[70%] left-[-100px] w-[40px] h-[1px] bg-gradient-to-r from-indigo-400 to-transparent opacity-0 animate-shoot-l-to-r"
          style={{ animationDelay: "4s", animationDuration: "5s" }}
        />
      </div>

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
