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

// ✅ ProfileDropdown component
const ProfileDropdown = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100"
      >
        <img
          src={user?.imageUrl}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium text-gray-800">{user?.firstName}</span>
        <span className="text-gray-500">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <SignOutButton>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        {/* Header */}
        <header className="w-full flex justify-between items-center bg-white sm:px-8 py-4 px-4 border-b border-b-[#e6ebf4]">
          <Link to="/">
            <img src={logo2} alt="logo" className="w-14 object-contain" />
          </Link>

          <div className="flex gap-x-4 items-center">
            <SignedIn>
              <Link
                to="/create-post"
                className="font-inter font-medium bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Create
              </Link>
              <ProfileDropdown /> {/* 👈 Dropdown here */}
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="font-inter font-medium bg-green-500 text-white px-4 py-2 rounded-md">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </header>

        {/* Main Content */}
        <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
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
        </main>
      </BrowserRouter>
    </ClerkProvider>
  );
};

export default App;
