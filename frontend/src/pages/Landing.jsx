import React from "react";
import Navbar from "../components/Navbar";
import imageBottomRight from "../assets/welcome.png";
import { SignInButton, SignOutButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  if (isSignedIn && window.location.pathname === "/") {
    navigate("/upload");
  } else {
    console.log(window.location);
    return (
      <div>
        <Navbar />
        <div className="container mx-auto text-center py-12">
          <h1 className="text-4xl lg:text-5xl font-semibold mb-4 mt-32 font-serif">
            {"WELCOME TO CLEAN CATALOGUE!"}
          </h1>
          <p className="text-lg text-gray-700 mb-8 font-serif">
            {`Elevate catalog management: AI-driven scanning and scoring for
            insights and efficiency.`}{" "}
            <br />{" "}
            {`Streamline operations and optimize
            performance with ease.`}
          </p>
          <div className="flex justify-center text-lg font-sans font-bold">
            <SignInButton
              afterSignInUrl="/upload"
              afterSignUpUrl="/upload"
              className="py-2 px-4 bg-blue-500 text-white rounded-md mr-4 hover:shadow-lg shadow-slate-950 transition-shadow duration-300 ease-in-out"
            />
            <img
              src={imageBottomRight}
              alt="image-bottom-right"
              className="absolute bottom-5 right-5 w-80 h-80"
            />
          </div>
        </div>
      </div>
    );
  }
};

export default Landing;
