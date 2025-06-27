import React from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const getCurrentPathname = () => {
    return window.location.pathname;
  };

  return (
    <div className="relative px-16 w-full h-16 flex justify-between items-center bg-blue-500">
      <div>
        <img
          src={logo}
          alt="logo"
          className="logo w-48 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        />
      </div>
      <div className="flex items-center">
        {isSignedIn ? (
          <div className="flex items-center justify-between">
            <div>
              <a
                href="/upload"
                className={`nav-link ml-4 font-semibold ${
                  getCurrentPathname() === "/upload" ? "active" : ""
                }`}
              >
                Upload
              </a>
            </div>
            <div>
              <a
                href="/dashboard"
                className={`nav-link ml-4 font-semibold ${
                  getCurrentPathname() === "/dashboard" ? "active" : ""
                }`}
              >
                Dashboard
              </a>
            </div>
            <div className="ml-4">
              <UserButton />
            </div>
          </div>
        ) : (
          <SignInButton
            afterSignInUrl="/upload"
            afterSignUpUrl="/upload"
            className="py-2 px-4 bg-white text-black rounded-md shadow-inner"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
