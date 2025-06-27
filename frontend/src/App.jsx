import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "@clerk/clerk-react";
import Welcome from "./pages/Welcome";
import "./components/navbar.css";
import Result from "./pages/Result";
import { useEffect, useState } from "react";

function App() {
  const { isSignedIn } = useAuth();

  return (
    <div>
      <BrowserRouter>
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
