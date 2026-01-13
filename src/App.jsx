import { useState } from 'react'
import Map from './components/Map.jsx'
import Panel from './components/Panel.jsx'
import DRONES from "./data/drones.js"
import './App.css'

function App() {

  const [drones, setDrones] = useState(DRONES)

  return (
      <main className="app">

      <Map drones={drones} />
      
      <Panel drones={drones} />

    </main>
  )
}

export default App