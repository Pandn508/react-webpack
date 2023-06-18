import React from "react";
import '@/app.css'
import '@/app.scss'
import Class from "./components/Class";
import { Demo1, Demo2 } from '@/components'

function App() {
  return (
    <div>
      <h2>webpack5-react-ts</h2>
      <Demo1 />
      <Class/>
    </div>
  )
}

export default App