import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmlubmRvbCIsImEiOiJjbGVnOHM4MmcwNDQxM3JteGw1emxmMGExIn0.coHR2EQE8TapTPA3lKlryg";

function getMarkerVariant(drone) {
  if (drone.batteryPct < 25) return "lowBattery";
  if (drone.status === "DELIVERY") return "delivering";
  if (drone.status === "STANDBY") return "standby";
  return "unknown";
}

const Map = ({ drones, hoveredDroneId }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);

  /**
   * EFFECT #1
   * Create map + shared popup once.
   */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.11, 51.5],
      zoom: 13,
    });

    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 8,
      anchor: "bottom",
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      popupRef.current?.remove();
      popupRef.current = null;

      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  /**
   * ✅ EFFECT #1.5 (NEW)
   * Show popup when hovering a row in the table.
   * IMPORTANT: This must be top-level (not nested).
   */
  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    if (!hoveredDroneId) {
      popupRef.current.remove();
      return;
    }

    const drone = drones.find((d) => d.id === hoveredDroneId);
    if (!drone) return;

    popupRef.current
      .setLngLat([drone.lng, drone.lat])
      .setHTML(`<div class="popup-tag">${drone.model ?? "Drone"}</div>`)
      .addTo(mapRef.current);
  }, [hoveredDroneId, drones]);

  /**
   * EFFECT #2
   * Sync markers to the `drones` prop (recreates markers).
   */
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    drones.forEach((drone) => {
      const variant = getMarkerVariant(drone);

      const el = document.createElement("div");
      el.className = `marker is-${variant}`;
      el.dataset.id = drone.id;

      el.addEventListener("mouseenter", () => {
        if (!popupRef.current || !mapRef.current) return;

        popupRef.current
          .setLngLat([drone.lng, drone.lat])
          .setHTML(`<div class="popup-tag">${drone.model ?? "Drone"}</div>`)
          .addTo(mapRef.current);
      });

      el.addEventListener("mouseleave", () => {
        popupRef.current?.remove();
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([drone.lng, drone.lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [drones]);

  return <div id="map-container" ref={mapContainerRef} />;
};

export default Map;