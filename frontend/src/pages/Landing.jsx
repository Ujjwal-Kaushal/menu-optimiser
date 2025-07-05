import React, { useEffect } from "react"; // FIX: Added useEffect to the import list
import imageBottomRight from "../assets/welcome.png";
import { SignInButton, useAuth } from "@clerk/clerk-react"; // FIX: Removed unused SignOutButton
import { useNavigate } from "react-router-dom";

const Landing = () => {
  // All hooks should be called at the top level of the component
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // This useEffect handles redirecting the user if they are already signed in.
  // It runs after the component renders, which prevents the "cannot update" warning.
  useEffect(() => {
    if (isSignedIn) {
      navigate("/upload");
    }
  }, [isSignedIn, navigate]); // Dependencies array is correct

  // The JSX to be rendered is returned here.
  // This will only be visible to users who are NOT signed in.
  return (
    <div>
      {/* <Navbar /> is correctly commented out as it's handled by App.jsx */}
      <div className="container mx-auto text-center py-12 relative"> {/* Added relative positioning for the image */}
        <h1 className="text-4xl lg:text-5xl font-semibold mb-4 mt-32 font-serif">
          WELCOME TO CLEAN CATALOGUE!
        </h1>
        <p className="text-lg text-gray-700 mb-8 font-serif">
          Elevate catalog management: AI-driven scanning and scoring for
          insights and efficiency. <br />
          Streamline operations and optimize
          performance with ease.
        </p>
        <div className="flex justify-center text-lg font-sans font-bold">
          <SignInButton
            afterSignInUrl="/upload"
            afterSignUpUrl="/upload"
            className="py-2 px-4 bg-blue-500 text-white rounded-md mr-4 hover:shadow-lg shadow-slate-950 transition-shadow duration-300 ease-in-out"
          />
        </div>
        <img
          src={imageBottomRight}
          alt="image-bottom-right"
          className="absolute bottom-5 right-5 w-80 h-80"
        />
      </div>
    </div>
  );
};

export default Landing;