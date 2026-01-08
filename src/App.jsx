import { useState } from 'react'
import Map from './components/Map.jsx'
import DRONES from "./data/drones.js"
import './App.css'

function App() {

  const [drones, setDrones] = useState(DRONES)

  return (
    <>
      <Map drones={drones}/>
    </>
  )
}

export default App
