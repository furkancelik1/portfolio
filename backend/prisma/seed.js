const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.project.deleteMany();
  console.log("Cleared existing projects.");

  const projects = [
    {
      title: "Yasin Karakurt Coaching Platform",
      description:
        "Kişisel antrenörler ve danışanları için geliştirilmiş; gerçek zamanlı Socket.io bildirimleri, su ve beslenme takibi modülleri, kişiselleştirilmiş antrenman programı yönetimi ve entegre ödeme altyapısı barındıran gelişmiş Full-Stack fitness yönetim ve subscription platformu.",
      content:
        "Yasin Karakurt Coaching Platform, profesyonel antrenörler ve bireysel danışanlar arasında köprü kuran kapsamlı bir fitness yönetim sistemidir. Next.js 14 ile geliştirilmiş ön yüz, Node.js ve Express ile güçlendirilmiş API katmanı, Prisma ORM ve PostgreSQL ile veritabanı yönetimi sunar. Socket.io ile gerçek zamanlı antrenman bildirimleri, su ve beslenme takip modülleri, özel antrenman programı oluşturma ve Stripe entegrasyonu ile abonelik yönetimi gibi gelişmiş özellikler barındırır. Zustand ile state yönetimi, Tailwind CSS ile modern ve responsive bir arayüz sağlanmıştır.",
      tags: [
        "Next.js",
        "Node.js",
        "TypeScript",
        "Prisma ORM",
        "PostgreSQL",
        "Socket.io",
        "Tailwind CSS",
      ],
      imageUrl: "/yasin-karakurt.jpg",
      githubUrl: "https://github.com/furkancelik1/yasin-karakurt",
      liveUrl: "https://yasin-karakurt.vercel.app",
    },
    {
      title: "Kozmik Alışkanlık & Rutin Takip Platformu (Tracking App)",
      description:
        "Kullanıcıların günlük disiplinlerini izleyen fütüristik bir PWA platformu. Entegre Stripe ödeme altyapısı, Next-i18n çoklu dil desteği, gelişmiş Recharts istatistik grafikleri, yapay zeka destekli koçluk tavsiyeleri ve kullanıcılar arası canlı düello (Duel Arena) ve oyunlaştırma (Gamification/Badge Shop) sistemleri içerir.",
      content:
        "Tracking App, kullanıcıların günlük alışkanlıklarını ve rutinlerini takip etmelerini sağlayan kapsamlı bir PWA uygulamasıdır. Next.js 15 ile geliştirilmiş ön yüz, Prisma ORM ve PostgreSQL ile güçlü veritabanı yönetimi, Stripe API ile abonelik ve ödeme entegrasyonu sunar. Çoklu dil desteği (Next-i18n), gelişmiş Recharts grafikleri ile istatistik takibi, yapay zeka destekli kişisel koçluk tavsiyeleri, kullanıcılar arası canlı düello arenası ve rozet/marka mağazası ile oyunlaştırma sistemi gibi yenilikçi özellikler barındırır. Shadcn UI ile modern arayüz ve Tailwind CSS ile responsive tasarım sağlanmıştır.",
      tags: [
        "Next.js 15",
        "TypeScript",
        "Prisma ORM",
        "Stripe API",
        "Tailwind CSS",
        "PWA",
        "Recharts",
      ],
      imageUrl: "/gym-app.jpg",
      githubUrl: "https://github.com/furkancelik1/tracking-app",
      liveUrl: "https://www.furkancelik.online/en",
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
    console.log(`Seeded: ${project.title}`);
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
