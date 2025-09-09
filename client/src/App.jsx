import React, { useState } from "react";
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

/* ========================= Profile Dropdown ========================== */
const ProfileDropdown = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger — fixed height/width to match Create button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          chip hover:opacity-90 transition
          h-10 min-w-[160px] px-3
          flex items-center justify-between
        "
      >
        <span className="flex items-center gap-2 min-w-0">
          <img
            src={user?.imageUrl}
            alt="profile"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="font-medium truncate">{user?.firstName}</span>
        </span>
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
            <Link to="/" className="flex items-center gap-3">
              {/* Bigger logo */}
              <img
                src={logo2}
                alt="logo"
                className="w-14 h-14 object-contain drop-shadow-sm"
              />
              <span className="sr-only">AI Image Studio</span>
            </Link>

            <div className="flex items-center gap-3">
              <SignedIn>
                {/* Create — same size as profile chip */}
                <Link
                  to="/create-post"
                  className="btn btn-accent h-10 min-w-[160px]"
                >
                  Create
                </Link>
                <ProfileDropdown />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn h-10 min-w-[160px]">Sign In</button>
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
