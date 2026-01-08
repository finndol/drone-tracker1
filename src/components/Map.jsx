
import { useRef, useEffect } from "react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiZmlubmRvbCIsImEiOiJjbGVnOHM4MmcwNDQxM3JteGw1emxmMGExIn0.coHR2EQE8TapTPA3lKlryg'

function getMarkerVariant(drone) {

    if (drone.batteryPct < 25) return "lowBattery"
    if (drone.status === "DELIVERY") return "delivering"
    if (drone.status === "STANDBY") return "standby"

    return "unknown"
}

const Map = ({drones}) => {

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);


    useEffect(() => {
        console.log("Map component mounted")
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-0.11, 51.50],
            zoom: 13
        });

        return () => {
            if (mapRef.current) {
                    mapRef.current.remove();
            }
        }
    }, [])

    useEffect(() => {
        if(!mapRef.current) return

        console.log('Creating markers')
        // clear old markers
        markersRef.current?.forEach(marker => marker.remove())
        markersRef.current = []

        drones.forEach(drone => {

        const varient = getMarkerVariant(drone)

            const el = document.createElement('div')
            el.className = `marker is-${varient}`
            el.dataset.id = drone.id

            const marker = new mapboxgl.Marker({
                element: el,
                anchor: 'center'
            })
                .setLngLat([drone.lng, drone.lat])
                .addTo(mapRef.current)

            markersRef.current.push(marker)
        })
        
    }, [drones])

    return (
        <div id="map-container" ref={mapContainerRef}> </div>
    )
}

export default Map