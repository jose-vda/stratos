"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { m as motion, AnimatePresence, useReducedMotion } from "motion/react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { sectionHref } from "@/lib/site";
import { useT } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";

// Rótulos de navegação traduzidos, mantendo os ids/hrefs de lib/site.ts.
function useNav() {
  const t = useT();
  const sectionNav = [
    { label: t.nav.services, id: "servicos" },
    { label: t.nav.diagnostic, id: "diagnostico" },
    { label: t.nav.process, id: "processo" },
    { label: t.nav.contact, id: "contato" },
  ];
  const pageNav = [
    { label: t.nav.about, href: "/sobre" },
    { label: t.nav.partners, href: "/parceiros" },
    { label: t.nav.blog, href: "/blog" },
  ];
  return { sectionNav, pageNav };
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  const t = useT();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={reduced ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="bg-brand-gradient inline-block h-2.5 w-2.5 rounded-full"
          />
          <span>Flywheel</span>
          <span className="text-muted-foreground">.dev</span>
        </Link>

        <DesktopNav pathname={pathname} />

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Link
            href={sectionHref("contato", pathname)}
            className={cn(buttonVariants(), "h-9 px-4 text-sm")}
          >
            {t.nav.talkNow}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <MobileNav pathname={pathname} onNavigate={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ------------------------------- Desktop ------------------------------- */

function DesktopNav({ pathname }: { pathname: string }) {
  const router = useRouter();
  const t = useT();
  const { sectionNav, pageNav } = useNav();
  // Menu controlado: permite fechar o popup no clique do "Home" sem brigar
  // com a abertura por hover (onValueChange cobre hover/teclado/Esc).
  const [value, setValue] = React.useState<string | null>(null);
  const homeOpen = value === "home";
  const homeActive = pathname === "/";

  const handleHomeClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
    // Fecha após a atualização interna do base-ui (que abre no press).
    requestAnimationFrame(() => setValue(null));
  };

  return (
    <NavigationMenu.Root
      value={value}
      onValueChange={setValue}
      className="hidden md:block"
    >
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item value="home">
          <NavigationMenu.Trigger
            onClick={handleHomeClick}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              homeActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.nav.home}
            <ChevronDown
              aria-hidden
              className={cn(
                "size-3.5 transition-transform duration-200",
                homeOpen && "rotate-180",
              )}
            />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="w-48">
            <ul className="flex flex-col">
              {sectionNav.map((item) => (
                <li key={item.id}>
                  <NavigationMenu.Link
                    closeOnClick
                    render={
                      <Link href={sectionHref(item.id, pathname)} />
                    }
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {pageNav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link
                active={active}
                render={<Link href={item.href} />}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          side="bottom"
          align="start"
          sideOffset={10}
          className="z-50"
        >
          <NavigationMenu.Popup
            className={cn(
              "origin-top rounded-xl border border-border bg-background/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-xl",
              "transition-[opacity,transform] duration-150 ease-out",
              "data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0",
              "data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0",
            )}
          >
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}

/* ------------------------------- Mobile -------------------------------- */

function MobileNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const t = useT();
  const { sectionNav, pageNav } = useNav();
  const [homeOpen, setHomeOpen] = React.useState(true);

  return (
    <div className="flex flex-col gap-1 px-6 py-4">
      <button
        type="button"
        onClick={() => setHomeOpen((v) => !v)}
        aria-expanded={homeOpen}
        className="flex items-center justify-between rounded-md px-3 py-3 text-base text-foreground transition-colors hover:bg-muted"
      >
        <span>{t.nav.home}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-4 transition-transform duration-200",
            homeOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {homeOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 border-l border-border pl-3">
              {sectionNav.map((item) => (
                <Link
                  key={item.id}
                  href={sectionHref(item.id, pathname)}
                  onClick={onNavigate}
                  className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-1 h-px bg-border" />

      {pageNav.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-3 text-base transition-colors hover:bg-muted",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}

      <Link
        href={sectionHref("contato", pathname)}
        onClick={onNavigate}
        className={cn(buttonVariants(), "mt-2 h-10 text-base")}
      >
        {t.nav.talkNow}
      </Link>
    </div>
  );
}
