"use client";

import { m } from "framer-motion";

import CommandPalette, { type CommandItem } from "@/components/CommandPalette";
import ThemeToggle from "@/components/ThemeToggle";
import { NAV_SECTIONS } from "@/data/commands";

export default function Sidebar({ commands }: { commands: CommandItem[] }) {
  return (
    <aside className="sidebar">
      <m.div
        className="profile-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="profile-name">Moss Louvan</h1>
        <p className="profile-title">Software Engineer · Iowa State University</p>
      </m.div>

      <m.nav
        className="sidebar-nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        {NAV_SECTIONS.map((label, i) => (
          <m.a
            key={label}
            href={`#${label.toLowerCase()}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
            whileHover={{ opacity: 0.55 }}
          >
            {label}
          </m.a>
        ))}
      </m.nav>

      {/* RIGHT SIDE controls: search + theme toggle */}
      <div className="header-right">
        <CommandPalette commands={commands} />
        <ThemeToggle />
      </div>
    </aside>
  );
}
