"use client";

import { useState, useEffect } from "react";
import { usePathname, Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const LOCALES = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

const NAV_HREFS = [
  { href: "/", short: "∅" },
  { href: "/projects", short: "≋" },
  { href: "/blog", short: "✦" },
  { href: "/about", short: "◎" },
  { href: "/contact", short: "→" },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/furkancelik1",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/ahmet-furkan-%C3%A7elik-099762398/",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com/furkancelik1111",
    label: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(code: string) {
    router.replace(pathname, { locale: code });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold tracking-wider text-white/40 border border-transparent hover:text-violet-300 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60" />
        {locale.toUpperCase()}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onMouseLeave={() => setOpen(false)}
            className="absolute right-0 top-full mt-1.5 min-w-[130px] bg-zinc-950/95 backdrop-blur-xl border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl"
          >
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLocale(loc.code)}
                className={[
                  "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center gap-3",
                  loc.code === locale
                    ? "text-violet-300 bg-violet-500/10"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    loc.code === locale
                      ? "bg-violet-500"
                      : "bg-zinc-600",
                  ].join(" ")}
                />
                <span className="font-mono text-[10px] tracking-wider opacity-50 w-6 shrink-0">
                  {loc.code.toUpperCase()}
                </span>
                <span>{loc.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [time, setTime] = useState("");

  const navLinks = NAV_HREFS.map((item) => ({
    ...item,
    label: t(item.href === "/" ? "home" : item.href.replace("/", "")),
  }));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Date().toLocaleTimeString(locale === "tr" ? "tr-TR" : locale, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Europe/Istanbul",
          })
        );
      } catch {
        setTime(new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Istanbul",
        }));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [locale]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "py-2 border-b border-white/5 bg-black/60 backdrop-blur-2xl"
            : "py-4 bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-violet-500/40 group-hover:border-violet-400/70 transition-colors duration-300" />
              <div className="absolute inset-[5px] rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 group-hover:from-violet-400 group-hover:to-indigo-500 transition-all duration-300" />
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[11px] tracking-[0.25em] uppercase text-white/30 font-light">
                Furkan
              </span>
              <span className="text-sm font-semibold text-white tracking-tight">
                Çelik
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "relative px-4 py-2 text-sm transition-colors duration-200 rounded-lg",
                    isActive
                      ? "text-white"
                      : "text-white/40 hover:text-white/80",
                  ].join(" ")}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <LanguageSwitcher />
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/20 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 animate-pulse" />
              <span>IST {time}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/25 hover:text-white/80 transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Menü"
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px]"
          >
            <span
              className={[
                "block w-5 h-[1.5px] bg-white/60 origin-center transition-all duration-300",
                mobileOpen ? "rotate-45 translate-y-[6.5px]" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-5 h-[1.5px] bg-white/60 transition-all duration-300",
                mobileOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "block w-5 h-[1.5px] bg-white/60 origin-center transition-all duration-300",
                mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-40 pt-20 pb-8 px-6 bg-black/90 backdrop-blur-2xl border-b border-white/8 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map(({ href, label, short }, i) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={href}
                      className={[
                        "flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors duration-150",
                        isActive
                          ? "bg-white/8 border border-white/10 text-white"
                          : "text-white/40 hover:text-white/70 hover:bg-white/4",
                      ].join(" ")}
                    >
                      <span className="text-base">{label}</span>
                      <span className="font-mono text-xs text-white/20">
                        {short}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="mt-8 pt-6 border-t border-white/8 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {SOCIAL_LINKS.map(({ href, label, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-white/25 hover:text-white/70 transition-colors"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-white/20 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
                  IST {time}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => {
                      setMobileOpen(false);
                    }}
                    className={[
                      "px-3 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 border",
                      loc.code === locale
                        ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                        : "border-zinc-800/60 text-white/40 hover:text-white/70 hover:border-zinc-700/60",
                    ].join(" ")}
                  >
                    {loc.code.toUpperCase()} — {loc.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
