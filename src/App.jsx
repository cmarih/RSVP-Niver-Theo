import { useState } from "react"
import InvitePage from "./Components/InvitePage/InvitePage"
import HomeScreen from "./Components/HomeScreen/HomeScreen"
import ConfirmedScreen from "./Components/ConfirmedScreen/ConfirmedScreen"
import DeclinedScreen from "./Components/DeclinedScreen/DeclinedScreen"

function App() {
  const [status, setStatus] = useState("invite")
  const [formData, setFormData] = useState(null)

  if (status === "form") {
    return <HomeScreen setStatus={setStatus} setFormData={setFormData} declineMode={false} />
  }

  if (status === "decline-form") {
    return <HomeScreen setStatus={setStatus} setFormData={setFormData} declineMode={true} />
  }

  if (status === "confirmed") {
    return <ConfirmedScreen data={formData} />
  }

  if (status === "declined") {
    return <DeclinedScreen data={formData} />
  }

  return <InvitePage onConfirmPresence={() => setStatus("form")} onDecline={() => setStatus("decline-form")} />
}

export default App