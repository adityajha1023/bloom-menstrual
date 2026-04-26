import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/track", label: "Track" },
  { to: "/calendar", label: "Calendar" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EFEFEF] bg-[#FFF7F9]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F6C1CC]">
            <span className="h-3 w-3 rounded-full bg-[#E8A0BF]" />
          </span>

          <span className="text-base font-medium tracking-[0.3px] text-[#2E2E2E]">
            bloom
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-sm text-[#2e2e2e] transition-all duration-200 hover:bg-[#F6C1CC]/40"
              activeProps={{
                className:
                  "rounded-full px-4 py-2 text-sm bg-[#F6C1CC]/60 text-[#2E2E2E]",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-full hover:bg-[#F6C1CC]/40 transition"
        >
          {open ? (
            <X className="h-5 w-5 text-[#2E2E2E]" />
          ) : (
            <Menu className="h-5 w-5 text-[#2E2E2E]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-[#EFEFEF] bg-[#FFF7F9] px-4 py-3 space-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-[#2E2E2E] hover:bg-[#F6C1CC]/40 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}