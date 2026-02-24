import "./ConfirmedScreen.css"

function ConfirmedScreen({ data }) {
  const handleGoBack = () => {
    window.location.reload()
  }

  return (
    <div className="confirmed-content">
      <img
        src="/img/avatar.png"
        alt="Avatar Théo"
        className="declined-image"
      />
      <h2 className="confirmed-title">
        Presença confirmada! 🎉
      </h2>

      {data && (
        <div className="confirmed-details">
          <p>Nome: {data.name}</p>
          <p>Adultos: {data.adults ?? data.guests ?? 0}</p>
          <p>Crianças: {data.children ?? 0}</p>
          <p>Total de acompanhantes: {data.guests ?? 0}</p>
        </div>
      )}

      <button onClick={handleAddToCalendar} className="submit-button confirmed-agenda-button">
        Adicionar na agenda 📅
      </button>
      
      <button onClick={handleGoBack} className="go-back-button">
        🏠 Voltar ao início
      </button>
    </div>
  )
}
const handleAddToCalendar = () => {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)

  if (isMobile) {
    const url = `https://calendar.app.google/hZYwe6nD6Bb1yAEy7`

    window.open(url, "_blank")
  } else {
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//RSVP Theo//PT-BR",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:aniversario-theo-20260426@rsvp-theo",
      "DTSTAMP:20260222T120000Z",
      "SUMMARY:Aniversário do Théo 🚀",
      "DESCRIPTION:Festa temática Astrobot",
      "LOCATION:Sítio da Festa",
      "DTSTART:20260426T160000",
      "DTEND:20260426T190000",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n")

    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" })
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "aniversario-theo.ics"
    link.click()

    window.URL.revokeObjectURL(url)
  }
}

export default ConfirmedScreen