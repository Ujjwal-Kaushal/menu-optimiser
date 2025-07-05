// frontend/src/App.jsx (Corrected and with user-syncing logic)

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { useUser } from "@clerk/clerk-react"; // --- CHANGE: useUser instead of useAuth
import Welcome from "./pages/Welcome";
import Navbar from "./components/Navbar"; // Assuming you want the navbar on all pages
import Result from "./pages/Result";
import { useEffect, useState } from "react";

function App() {
  // --- PASTE THE USER-SYNCING LOGIC HERE ---
  // --- CHANGE: Switched to useUser to get user details ---
  const { isSignedIn, user } = useUser(); 
  const [isUserSynced, setIsUserSynced] = useState(false);

  useEffect(() => {
    // Check if user is logged in, has details, and hasn't been synced yet
    if (isSignedIn && user && !isUserSynced) {
      console.log("User is signed in, attempting to sync to our database...");

      const userData = {
        name: user.fullName || `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress.emailAddress,
        authID: user.id, // The Clerk User ID
      };
      
      // Make sure your backend API URL is correct.
      // This uses VITE_BASE_API from your .env file
      // If your server is at http://localhost:3000, this will become 'http://localhost:3000/create'
      fetch(`${import.meta.env.VITE_BASE_API}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Sync response from backend:", data.message);
          setIsUserSynced(true); // Mark as synced to prevent re-running this on every render
        })
        .catch((error) => {
          console.error("Error syncing user to DB:", error);
        });
    }
  }, [isSignedIn, user, isUserSynced]); // Dependencies for the effect
  // --- END OF PASTED LOGIC ---

  return (
    <div>
      <BrowserRouter>
        {/* I've added your Navbar here so it appears on all pages */}
        <Navbar /> 
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Welcome />} />
          <Route path="/" element={<Landing />} />
          <Route path="/result/:id" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;