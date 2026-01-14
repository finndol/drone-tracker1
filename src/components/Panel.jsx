import activeIcon from "../assets/icons/icon-active.svg";
import lowIcon from "../assets/icons/icon-low-bat.svg";
import readyIcon from "../assets/icons/icon-ready.svg";
import FleetTable from "./FleetTable";

export default function Panel({ drones, onHoverDrone }) {
  function calculateActiveDrones() {
    return drones.filter((drone) => drone.status === "DELIVERY" && drone.batteryPct > 25).length;
  }

  function calculateAvailableDrones() {
    return drones.filter((drone) => drone.status === "STANDBY" && drone.batteryPct > 25).length;
  }

  function calculateLowBatDrones() {
    return drones.filter((drone) => drone.batteryPct < 25).length;
  }

  return (
    <div className="panel-wrap">
      <h1 className="panel_title">Fleet Overview</h1>

      <div className="panel_stats-grid">
        <div className="stat-card stat-active">
          <div className="stat_header">
            <img src={activeIcon} />
            <div className="stat-label text-blue">ACTIVE</div>
          </div>
          <div className="stat-value">{calculateActiveDrones()}</div>
        </div>

        <div className="stat-card stat-ready">
          <div className="stat_header">
            <img src={readyIcon} />
            <div className="stat-label is-active">READY</div>
          </div>
          <div className="stat-value">{calculateAvailableDrones()}</div>
        </div>

        <div className="stat-card stat-low">
          <div className="stat_header">
            <img src={lowIcon} />
            <div className="stat-label">LOW BAT</div>
          </div>
          <div className="stat-value">{calculateLowBatDrones()}</div>
        </div>
      </div>

      {/* ✅ NEW */}
      <FleetTable drones={drones} onHoverDrone={onHoverDrone} />
    </div>
  );
}