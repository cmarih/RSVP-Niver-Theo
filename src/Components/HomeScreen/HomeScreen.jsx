import { useState } from "react"
import "./HomeScreen.css"

function HomeScreen({ setStatus, setFormData }) {
  const [name, setName] = useState("")
  const [willAttend, setWillAttend] = useState(null)
  const [guests, setGuests] = useState("")

  function handleSubmit(e) {
    e.preventDefault()

    const data = {
      name,
      willAttend,
      guests: willAttend ? Number(guests) : 0
    }

    setFormData(data)

    if (willAttend) {
      setStatus("confirmed")
    } else {
      setStatus("declined")
    }
  }

  const isNameFilled = name.trim() !== ""
  const isGuestsValid = Number(guests) > 0

  const shouldShowSubmit =
    isNameFilled &&
    willAttend !== null &&
    (willAttend === false || isGuestsValid)

  return (
  <form onSubmit={handleSubmit} className="form-container">
    <input
      type="text"
      placeholder="Seu nome completo"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="input"
    />

    {isNameFilled && (
      <div className="button-group">
        {willAttend !== false && (
          <button
            type="button"
            onClick={() => setWillAttend(true)}
            className={`button ${
              willAttend === true ? "active-confirm" : ""
            }`}
          >
            Confirmar presença
          </button>
        )}

        {willAttend !== true && (
          <button
            type="button"
            onClick={() => setWillAttend(false)}
            className={`button ${
              willAttend === false ? "active-decline" : ""
            }`}
          >
            Não poderei ir
          </button>
        )}
      </div>
    )}

    {willAttend !== null && (
      <button
        type="button"
        className="change-option-button"
        onClick={() => {
          setWillAttend(null)
          setGuests("")
        }}
      >
        Alterar resposta
      </button>
    )}

    {willAttend === true && (
      <input
        type="number"
        placeholder="Quantas pessoas irão?"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="input"
      />
    )}

    {shouldShowSubmit && (
      <button type="submit" className="submit-button">
        Enviar
      </button>
    )}
  </form>
)
}

export default HomeScreen