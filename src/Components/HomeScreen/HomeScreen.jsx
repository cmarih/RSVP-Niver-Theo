import { useState, useEffect } from "react"
import "./HomeScreen.css"
import { supabase } from "../../lib/supabaseClient"

function HomeScreen({ setStatus, setFormData }) {
  const [name, setName] = useState("")
  const [willAttend, setWillAttend] = useState(null)
  const [guests, setGuests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [existingRsvp, setExistingRsvp] = useState(null)
  const [isCheckingExisting, setIsCheckingExisting] = useState(false)

  async function checkExistingRsvp(nameToCheck) {
    if (!nameToCheck.trim()) return

    setIsCheckingExisting(true)
    
    try {
      const { data, error } = await supabase
        .from("rsvps")
        .select("*")
        .ilike("name", nameToCheck.trim())
        .maybeSingle()

      setIsCheckingExisting(false)

      if (data && !error) {
        setExistingRsvp(data)
        // Bloquear o formulário se já existe confirmação
        setWillAttend(null)
        setGuests("")
      } else {
        setExistingRsvp(null)
      }
    } catch (err) {
      console.error("Erro ao verificar RSVP existente:", err)
      setIsCheckingExisting(false)
      setExistingRsvp(null)
    }
  }

  // Validações de segurança
  const validateInput = () => {
    const trimmedName = name.trim()
    
    if (trimmedName.length < 3) {
      setSubmitError("Nome deve ter pelo menos 3 caracteres.")
      return false
    }
    
    if (trimmedName.length > 20) {
      setSubmitError("Nome muito longo. Use no máximo 20 caracteres.")
      return false
    }
    
    if (willAttend === true && (Number(guests) < 1 || Number(guests) > 4)) {
      setSubmitError("Número de pessoas deve estar entre 1 e 4.")
      return false
    }
    
    // Verificar caracteres suspeitos (básico)
    const suspiciousChars = /[<>\"';]/
    if (suspiciousChars.test(trimmedName)) {
      setSubmitError("Nome contém caracteres não permitidos.")
      return false
    }
    
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError("")

    // Não permitir submit se já existe confirmação
    if (existingRsvp) {
      setSubmitError("Este nome já confirmou presença. Não é possível alterar.")
      return
    }

    // Validar entrada antes de enviar
    if (!validateInput()) {
      return
    }

    const data = {
      name: name.trim(),
      willAttend,
      guests: willAttend ? Number(guests) : 0
    }

    setIsSubmitting(true)

    try {
      // Apenas INSERT - sem UPDATE
      const result = await supabase
        .from("rsvps")
        .insert({
          name: data.name,
          will_attend: data.willAttend,
          guests: data.guests
        })
        .select()

      if (result.error) {
        console.error("Erro no Supabase:", result.error)
        setIsSubmitting(false)
        
        let errorMessage = "Não foi possível salvar sua resposta. "
        
        if (result.error.code === '23505' || result.error.message.includes('duplicate')) {
          errorMessage = `${data.name} foi usado para confirmar presença anteriormente.`
        } else if (result.error.message.includes('policy')) {
          errorMessage = "Erro de permissão. Entre em contato para suporte."
        } else {
          errorMessage += "Tente novamente."
        }
        
        setSubmitError(errorMessage)
        return
      }

      console.log("RSVP salvo com sucesso:", result.data)
      setFormData(data)
      setIsSubmitting(false)

      if (willAttend) {
        setStatus("confirmed")
      } else {
        setStatus("declined")
      }
      
    } catch (error) {
      console.error("Erro inesperado:", error)
      setIsSubmitting(false)
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.")
    }
  }

  // Efeito para verificar se já existe RSVP quando o nome for digitado
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (name.trim().length >= 3) {
        checkExistingRsvp(name)
      } else {
        setExistingRsvp(null)
      }
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [name])

  const isNameFilled = name.trim() !== ""
  const isGuestsValid = Number(guests) > 0
  const hasExistingRsvp = existingRsvp !== null

  const shouldShowSubmit =
    isNameFilled &&
    willAttend !== null &&
    (willAttend === false || isGuestsValid) &&
    !hasExistingRsvp // Bloquear se já tem confirmação

  return (
  <form onSubmit={handleSubmit} className="form-container">
    <input
      type="text"
      placeholder="Seu nome completo"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="input"
      maxLength="100"
      required
      autoComplete="name"
    />

    {isCheckingExisting && (
      <p className="checking-existing">Verificando confirmação anterior...</p>
    )}

    {hasExistingRsvp && (
      <div className="existing-rsvp-info">
        <p className="existing-rsvp-message">
          ✅ {existingRsvp.name} já confirmou presença!
        </p>
        <div className="existing-details">
          <p>Resposta: <strong>{existingRsvp.will_attend ? 'Presença confirmada' : 'Não poderá ir'}</strong></p>
          {existingRsvp.will_attend && (
            <p>Acompanhantes: <strong>{existingRsvp.guests}</strong></p>
          )}
          <p className="no-change-message">
            ❌ Para alterar a confirmação, entre em contato conosco.
          </p>
        </div>
        
        <button 
          onClick={() => window.location.reload()} 
          className="go-back-button"
        >
          🏠 Voltar ao início
        </button>
      </div>
    )}

    {isNameFilled && !hasExistingRsvp && (
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

    {willAttend === true && !hasExistingRsvp && (
      <input
        type="number"
        placeholder="Quantas pessoas irão?"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="input"
        min="1"
        max="4"
        required
      />
    )}

    {willAttend !== null && !hasExistingRsvp && (
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

    {shouldShowSubmit && (
      <>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
        {submitError && (
          <p className="submit-error">{submitError}</p>
        )}
      </>
    )}
  </form>
)
}

export default HomeScreen