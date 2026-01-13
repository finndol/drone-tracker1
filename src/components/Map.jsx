import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmlubmRvbCIsImEiOiJjbGVnOHM4MmcwNDQxM3JteGw1emxmMGExIn0.coHR2EQE8TapTPA3lKlryg";

/**
 * Determines which visual variant a marker should use
 * based on drone state.
 */
function getMarkerVariant(drone) {
  if (drone.batteryPct < 25) return "lowBattery";
  if (drone.status === "DELIVERY") return "delivering";
  if (drone.status === "STANDBY") return "standby";
  return "unknown";
}

const Map = ({ drones }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);

  /**
   * EFFECT #1
   * ------------------------------------------------
   * Create the Mapbox map and a single shared Popup.
   * This runs once on mount and cleans everything up
   * when the component unmounts.
   */
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.11, 51.5],
      zoom: 13,
    });

    // Create a single shared popup (reused for all markers)
    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 8,
      anchor: "bottom",
    });

    // Cleanup on unmount
    return () => {
      // Remove all markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Remove popup
      popupRef.current?.remove();
      popupRef.current = null;

      // Remove map
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  /**
   * EFFECT #2
   * ------------------------------------------------
   * Sync markers to the `drones` prop.
   * Whenever drones change:
   *  - remove existing markers
   *  - create new markers
   *  - attach hover events to show/hide the popup
   */
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    drones.forEach((drone) => {
      const variant = getMarkerVariant(drone);

      // Create marker DOM element
      const el = document.createElement("div");
      el.className = `marker is-${variant}`;
      el.dataset.id = drone.id;

      // Show popup on hover
      el.addEventListener("mouseenter", () => {
        if (!popupRef.current || !mapRef.current) return;

        popupRef.current
          .setLngLat([drone.lng, drone.lat])
          .setHTML(`<div class="popup-tag">${drone.model ?? "Drone"}</div>`)
          .addTo(mapRef.current);
      });

      // Hide popup on leave
      el.addEventListener("mouseleave", () => {
        popupRef.current?.remove();
      });

      // Create and add marker to map
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