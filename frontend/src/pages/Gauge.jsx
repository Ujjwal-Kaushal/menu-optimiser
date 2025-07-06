// frontend/src/pages/Gauge.jsx

import React from "react";
import "./Gauge.css";

// --- SIMPLIFIED: Removed unnecessary useState ---
const Gauge = ({ score = 0 }) => { // Default score to 0 to prevent errors
  // Directly calculate the rotation from the score prop.
  // The score is expected to be between 0 and 1.
  const rotation = score / 2;

  return (
    <div className="gauge">
      <div
        className="gauge__fill"
        // Ensure the value is within the 0-1 range for the CSS transform
        style={{ transform: `rotate(${Math.max(0, Math.min(rotation, 0.5))}turn)` }}
      ></div>
      {/* Multiply by 100 to display as a percentage */}
      <div className="gauge__cover">{Math.round(score * 100)}%</div>
    </div>
  );
};

export default Gauge;