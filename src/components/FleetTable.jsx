import { useState } from "react";
import batteryIcon from "../assets/icons/battery-table.svg"
import chevron from "../assets/icons/chevron.svg"

export default function FleetTable({ drones = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="fleet">
      {/* Header */}
      <div className="fleet__header">
        <div className="fleet__th">MODEL</div>
        <div className="fleet__th">STATUS</div>
        <div className="fleet__th">BAT</div>
        <div className="fleet__th fleet__th--right">ETA</div>
      </div>

      {/* Scroll container */}
      <div className={`fleet__scroll ${isExpanded ? "is-expanded" : ""}`}>
        <div className="fleet__body">
          {drones.length === 0 && (
            <div className="fleet__empty">No drones available</div>
          )}

          {drones.map((drone) => (
            <div className="fleet__row" key={drone.id}>
              {/* MODEL */}
              <div className="fleet__cell fleet__model">
                <span
                  className={`fleet__dot fleet__dot--${getDotVariant(drone)}`}
                  aria-hidden="true"
                />
                <span className="fleet__modelText">
                  {drone.model ?? "Skyrunner X1"}
                </span>
              </div>

              {/* STATUS */}
              <div className="fleet__cell fleet__status">
                {formatStatus(drone)}
              </div>

              {/* BATTERY */}
              <div className="fleet__cell fleet__bat">
                <img src={batteryIcon} className="fleet__batIcon" />
                <span className="fleet__batText">
                  {Math.round(drone.batteryPct ?? 0)}%
                </span>
              </div>

              {/* ETA */}
              <div className="fleet__cell fleet__eta">
                {formatEta(drone)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <button
        type="button"
        className="fleet__toggle"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
      >
        <span className="fleet__toggleText">
          {isExpanded ? "VIEW LESS" : "VIEW ALL"}
        </span>
        <span
          className={`fleet__chev ${isExpanded ? "is-open" : ""}`}
          aria-hidden="true"
        >
          <img src={chevron} />
        </span>
      </button>
    </section>
  );
}

/* ======================
   Helpers
   ====================== */

function formatStatus(drone) {
  if (drone.batteryPct < 25) return "LOW BAT";
  if (drone.status === "DELIVERY") return "ACTIVE";
  if (drone.status === "STANDBY") return "READY";
  return drone.status ?? "UNKNOWN";
}

function formatEta(drone) {
  if (drone.etaMin == null) return "N/A";
  return `${drone.etaMin} mins`;
}

function getDotVariant(drone) {
  if (drone.batteryPct < 25) return "low";
  if (drone.status === "DELIVERY") return "active";
  if (drone.status === "STANDBY") return "ready";
  return "muted";
}