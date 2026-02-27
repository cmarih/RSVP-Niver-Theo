import { useState } from "react"
import InvitePage from "./components/InvitePage/InvitePage"
import HomeScreen from "./Components/HomeScreen/HomeScreen"
import ConfirmedScreen from "./Components/ConfirmedScreen/ConfirmedScreen"
import DeclinedScreen from "./Components/DeclinedScreen/DeclinedScreen"

function App() {
  const [status, setStatus] = useState("invite")
  const [formData, setFormData] = useState(null)

  if (status === "form") {
    return <HomeScreen setStatus={setStatus} setFormData={setFormData} />
  }

  if (status === "confirmed") {
    return <ConfirmedScreen data={formData} />
  }

  if (status === "declined") {
    return <DeclinedScreen data={formData} />
  }

  return <InvitePage onConfirmPresence={() => setStatus("form")} />
}

export default App