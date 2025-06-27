import React, { useState } from "react";
import "./Gauge.css";

const Gauge = ({ score }) => {
  const [gaugeValue, setGaugeValue] = useState(score / 100);

  const updateGauge = (value) => {
    if (value < 0 || value > 1) {
      return;
    }

    setGaugeValue(value);
  };

  return (
    <div className="gauge">
      <div
        className="gauge__fill"
        style={{ transform: `rotate(${gaugeValue / 2}turn)` }}
      ></div>
      <div className="gauge__cover">{Math.round(gaugeValue * 100)}%</div>
    </div>
  );
};

export default Gauge;
