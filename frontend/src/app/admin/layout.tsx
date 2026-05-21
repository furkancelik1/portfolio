"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [status, pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303]">
        <div className="size-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

const sidebarLinks = [
  { href: "/admin/mesajlar", label: "Gelen Mesajlar", icon: "✉" },
  { href: "/admin/projects", label: "Projeler", icon: "⚡" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return (
      <SessionProvider>
        <AuthGuard>{children}</AuthGuard>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <AuthGuard>
        <div className="flex min-h-screen bg-[#030303]">
          <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-white/[0.04] bg-[#070708]">
            <div className="flex items-center gap-2.5 border-b border-white/[0.04] px-5 py-5">
              <span className="text-lg">✦</span>
              <span className="text-sm font-semibold text-white/80">
                Admin Panel
              </span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-5">
              {sidebarLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-indigo-500/10 text-indigo-300"
                        : "text-white/40 hover:bg-white/[0.03] hover:text-white/70"
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 -z-10 rounded-lg bg-indigo-500/10"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/[0.04] px-3 pb-5 pt-4">
              <Link
                href="/"
                className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/30 transition hover:text-white/60"
              >
                ← Siteye Dön
              </Link>
            </div>
          </aside>

          <main className="ml-60 flex-1 px-8 py-8">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </AuthGuard>
    </SessionProvider>
  );
}
