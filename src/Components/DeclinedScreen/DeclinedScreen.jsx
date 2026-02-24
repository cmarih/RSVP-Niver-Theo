import "./DeclinedScreen.css"

function DeclinedScreen({ data }) {
  const handleGoBack = () => {
    window.location.reload()
  }

  return (
    <div className="declined-content">
      <img
        src="/img/astro-bot-triste.png"
        alt="Astro Bot triste"
        className="declined-image"
      />
      <h2 className="declined-title">
        Sentiremos sua falta
      </h2>
      
      <button onClick={handleGoBack} className="go-back-button">
        🏠 Voltar ao início
      </button>
    </div>
  )
}

export default DeclinedScreen