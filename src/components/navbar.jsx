import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
  const DotIcon = () => {
    return (
      <FaUser />
      // <svg
      //   xmlns="http://www.w3.org/2000/svg"
      //   viewBox="0 0 512 512"
      //   fill="currentColor"
      // >
      //   <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      // </svg>
    );
  };

  return (
    <div className="w-full">
      <nav className="flex justify-between items-center p-4 px-16 bg-white shadow-md w-full">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex text-2xl font-bold text-gray-800">
            <img src="../../public/logo.png" alt="logo" style={{ width: '70px', height: '40px'}} />
            GradGoods
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link to="/postListing" className="text-lg text-gray-800 transition duration-300 ease-in-out hover:text-green-500">
              Sell
            </Link>{" "}
            {/* Use Link instead of a */}
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="View profile"
                  labelIcon={<DotIcon />}
                  href="/profile"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </nav>
    </div>
  );
}
