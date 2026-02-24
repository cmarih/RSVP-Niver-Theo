import { useState, useEffect } from "react"
import HomeScreen from "./Components/HomeScreen/HomeScreen"
import ConfirmedScreen from "./Components/ConfirmedScreen/ConfirmedScreen"
import DeclinedScreen from "./Components/DeclinedScreen/DeclinedScreen"
import "./App.css"

function App() {
  const [status, setStatus] = useState("idle")
  const [formData, setFormData] = useState(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => {
      setAnimate(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [status])

  return (
    <div className="app-container">
      <div className="page-brand">
        <img
          src="/img/logo.png"
          alt="Logo do evento"
          className="page-logo"
        />
        <img
          src="/img/astro-bot.png"
          alt="Astro Bot"
          className="page-astro"
        />
      </div>

      <div className={`card ${animate ? "fade" : ""}`}>
        {status !== "declined" && (
          <>
            <img
              src="/img/icone.png"
              alt="Ícone do evento"
              className="card-icon"
            />
            <img
              src="/img/nome-theo.png"
              alt="Nome Théo"
              className="card-name"
            />
          </>
        )}
        {status === "idle" && <h1>Confirmação de presença</h1>}

        {status === "idle" && (
          <HomeScreen
            setStatus={setStatus}
            setFormData={setFormData}
          />
        )}

        {status === "confirmed" && (
          <ConfirmedScreen
            data={formData}
          />
        )}

        {status === "declined" && (
          <DeclinedScreen
            data={formData}
          />
        )}
      </div>
    </div>
  )
}

export default App