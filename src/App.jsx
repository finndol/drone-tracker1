import { useState } from "react";
import Map from "./components/Map.jsx";
import Panel from "./components/Panel.jsx";
import DRONES from "./data/drones.js";
import "./App.css";

function App() {
  const [drones] = useState(DRONES);

  // ✅ NEW: shared hover state (table -> map popup)
  const [hoveredDroneId, setHoveredDroneId] = useState(null);

  return (
    <main className="app">
      <Map drones={drones} hoveredDroneId={hoveredDroneId} />

      <Panel
        drones={drones}
        // ✅ NEW: pass setter down to FleetTable (via Panel)
        onHoverDrone={setHoveredDroneId}
      />
    </main>
  );
}

export default App;