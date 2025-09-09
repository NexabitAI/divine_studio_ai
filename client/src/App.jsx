import React, { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignOutButton,
  SignInButton,
  useUser,
} from "@clerk/clerk-react";

import { logo2 } from "./assets";
import { Home, CreatePost } from "./pages";

const PUBLISHABLE_KEY = "pk_live_Y2xlcmsuZGl2aW5lc3R1ZGlvLnBybyQ";

/* ============================ Theme Toggle ============================ */
const THEME_KEY = "theme"; // 'soft-dark' | 'hc' | null => default (Glassy Dark)

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "soft-dark" || theme === "hc") {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }
}

const ThemeToggle = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      if (theme) localStorage.setItem(THEME_KEY, theme);
      else localStorage.removeItem(THEME_KEY);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const options = [
    { key: "", label: "Glassy Dark", icon: "🌌" },
    { key: "soft-dark", label: "Soft Dark", icon: "🌙" },
    { key: "hc", label: "High Contrast", icon: "⚡" },
  ];

  const active = options.find((o) => o.key === theme) || options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="chip glass hover:opacity-90 transition animate-in"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Theme"
      >
        <span className="text-sm">{active.icon}</span>
        <span className="text-sm">{active.label}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-44 p-1 glass-strong z-50"
        >
          {options.map((o) => (
            <button
              key={o.key || "default"}
              onClick={() => {
                setTheme(o.key);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white/10 ${
                theme === o.key ? "elevate" : ""
              }`}
              role="menuitem"
            >
              <span className="mr-2">{o.icon}</span>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
/* ===================================================================== */

/* ========================= Profile Dropdown ========================== */
const ProfileDropdown = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="chip hover:opacity-90 transition"
      >
        <img
          src={user?.imageUrl}
          alt="profile"
          className="w-7 h-7 rounded-full object-cover"
        />
        <span className="font-medium">{user?.firstName}</span>
        <span aria-hidden>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-44 glass-strong p-1 rounded-lg z-50">
          <SignOutButton>
            <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-white/10">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
};
/* ===================================================================== */

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        {/* Header */}
        <header className="sticky top-0 z-40 w-full glass elevate sm:px-8 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo2}
                alt="logo"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <span className="sr-only">AI Image Studio</span>
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <SignedIn>
                <Link to="/create-post" className="btn btn-accent">
                  Create
                </Link>
                <ProfileDropdown />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn">Sign In</button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="sm:p-8 px-4 py-8 w-full min-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/create-post"
                element={
                  <SignedIn>
                    <CreatePost />
                  </SignedIn>
                }
              />
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default App;
