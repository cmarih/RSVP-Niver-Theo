import "./InviteScreen.css"

function InviteScreen({ onConfirmAttendance }) {
  return (
    <div className="invite-container">
      <div className="invite-content">
        
        <div className="event-details">
          <div className="event-info">
            
            <svg className="curved-text" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="curve" d="M 50,120 Q 250,20 450,120" fill="transparent" />
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#07196d', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1386bb', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <text 
                className="invite-title-curved" 
                textAnchor="middle" 
                fill="url(#textGradient)"
                fontFamily="Audiowide, system-ui, sans-serif"
                fontSize="48"
                fontWeight="400"
                letterSpacing="0.5"
              >
                <textPath href="#curve" startOffset="50%">
                  Você está convidado!
                </textPath>
              </text>
            </svg>
            
            <img
              src="/img/nome-theo.png"
              alt="Nome Théo"
              className="invite-name"
            />

            <h2>faz 6 anos</h2>
            
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-text">26/04/2026</span> 
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏰</span>
                <span className="detail-text">16h</span> 
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-text"><strong>Jad Salão de Festa e Eventos</strong> <br/>
              R. John Lenon, 1396 - Areias, São José - SC, 88113-720
              </span>
            </div>
          </div>

          <div className="invite-message">
            <p>
              Contamos com sua presença para tornar esse momento inesquecível! 🎉
            </p>
          </div>
        </div>

        <div className="invite-actions">
          <button 
            className="confirm-button"
            onClick={onConfirmAttendance}
          >
            Confirmar Presença
          </button>
        </div>

        <div className="invite-footer">
          <p className="footer-text">
            Esperamos você lá! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}

export default InviteScreen