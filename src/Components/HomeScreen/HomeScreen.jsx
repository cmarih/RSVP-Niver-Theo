import { useState, useEffect } from "react"
import "./HomeScreen.css"
import { supabase } from "../../lib/supabaseClient"
import HeroSection from "../InvitePage/HeroSection"

const PENDING_RSVPS_KEY = "pending-rsvps"

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getPendingRsvps() {
  try {
    const rawValue = localStorage.getItem(PENDING_RSVPS_KEY)
    return rawValue ? JSON.parse(rawValue) : []
  } catch {
    return []
  }
}

function savePendingRsvps(items) {
  localStorage.setItem(PENDING_RSVPS_KEY, JSON.stringify(items))
}

function enqueuePendingRsvp(data) {
  const queue = getPendingRsvps()
  queue.push({
    id: Date.now(),
    ...data
  })
  savePendingRsvps(queue)
}

function removePendingRsvpById(id) {
  const queue = getPendingRsvps().filter((item) => item.id !== id)
  savePendingRsvps(queue)
}

async function insertRsvpWithRetry(data, maxAttempts = 3) {
  const payload = {
    name: data.name,
    will_attend: data.willAttend,
    adults_guests: data.adults,
    children_guests: data.children,
    guests: data.guests
  }

  let lastError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("timeout")), 12000)
      })

      const requestPromise = supabase.from("rsvps").insert(payload).select()

      const result = await Promise.race([requestPromise, timeoutPromise])

      if (result.error) {
        throw result.error
      }

      return result.data
    } catch (error) {
      lastError = error

      const message = String(error?.message || "").toLowerCase()
      const isDuplicate = error?.code === "23505" || message.includes("duplicate")

      if (isDuplicate) {
        return []
      }

      const isRetryable =
        message.includes("timeout") ||
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("failed")

      if (!isRetryable || attempt === maxAttempts) {
        break
      }

      await wait(900 * attempt)
    }
  }

  throw lastError
}

function HomeScreen({ setStatus, setFormData }) {
  const [name, setName] = useState("")
  const [willAttend, setWillAttend] = useState(null)
  const [adultGuests, setAdultGuests] = useState("")
  const [childGuests, setChildGuests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitInfo, setSubmitInfo] = useState("")
  const [existingRsvp, setExistingRsvp] = useState(null)
  const [isCheckingExisting, setIsCheckingExisting] = useState(false)

  async function syncPendingRsvps() {
    const queue = getPendingRsvps()

    if (!queue.length || !navigator.onLine) {
      return
    }

    for (const item of queue) {
      try {
        await insertRsvpWithRetry(item, 2)
        removePendingRsvpById(item.id)
      } catch {
        return
      }
    }
  }

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
        setAdultGuests("")
        setChildGuests("")
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
    
    if (willAttend === true) {
      const adults = Number(adultGuests || 0)
      const children = Number(childGuests || 0)
      const totalGuests = adults + children

      if (adults < 0 || children < 0) {
        setSubmitError("As quantidades de adultos e crianças não podem ser negativas.")
        return false
      }

      if (totalGuests < 1 || totalGuests > 4) {
        setSubmitError("Total de acompanhantes (adultos + crianças) deve estar entre 1 e 4.")
        return false
      }
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
    setSubmitInfo("")

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
      adults: willAttend ? Number(adultGuests || 0) : 0,
      children: willAttend ? Number(childGuests || 0) : 0,
      guests: willAttend ? Number(adultGuests || 0) + Number(childGuests || 0) : 0
    }

    setIsSubmitting(true)

    try {
      await insertRsvpWithRetry(data)
      setFormData(data)
      setIsSubmitting(false)

      if (willAttend) {
        setStatus("confirmed")
      } else {
        setStatus("declined")
      }
      
    } catch (error) {
      console.error("Erro inesperado:", error)
      const message = String(error?.message || "").toLowerCase()

      const isConnectionError =
        !navigator.onLine ||
        message.includes("timeout") ||
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("failed")

      if (isConnectionError) {
        enqueuePendingRsvp(data)
        setIsSubmitting(false)
        setSubmitInfo("Conexão instável: sua resposta foi guardada no aparelho e será reenviada quando a internet voltar.")
        return
      }

      setIsSubmitting(false)
      setSubmitError("Não foi possível salvar sua resposta agora. Tente novamente.")
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

  useEffect(() => {
    syncPendingRsvps()

    const handleOnline = async () => {
      await syncPendingRsvps()
      const pendingCount = getPendingRsvps().length

      if (pendingCount === 0) {
        setSubmitInfo("Conexão restabelecida: respostas pendentes enviadas com sucesso.")
      }
    }

    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  const isNameFilled = name.trim() !== ""
  const totalGuests = Number(adultGuests || 0) + Number(childGuests || 0)
  const isGuestsValid = totalGuests > 0 && totalGuests <= 4
  const hasExistingRsvp = existingRsvp !== null

  const shouldShowSubmit =
    isNameFilled &&
    willAttend !== null &&
    (willAttend === false || isGuestsValid) &&
    !hasExistingRsvp // Bloquear se já tem confirmação

  return (
  <div className="home-page">
    <div className="star-layer" aria-hidden="true" />
    <img 
      src="/img/logo.png" 
      alt="Logo" 
      className="home-logo"
    />
    <HeroSection showSubtitle={false} />
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
            <>
              <p>Adultos: <strong>{existingRsvp.adults_guests ?? existingRsvp.guests ?? 0}</strong></p>
              <p>Crianças: <strong>{existingRsvp.children_guests ?? 0}</strong></p>
              <p>Total de acompanhantes: <strong>{(existingRsvp.adults_guests ?? existingRsvp.guests ?? 0) + (existingRsvp.children_guests ?? 0)}</strong></p>
            </>
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
      <div className="guests-grid">
        <input
          type="number"
          placeholder="Qtd. adultos"
          value={adultGuests}
          onChange={(e) => setAdultGuests(e.target.value)}
          className="input"
          min="0"
          max="4"
          required
        />
        <input
          type="number"
          placeholder="Qtd. crianças"
          value={childGuests}
          onChange={(e) => setChildGuests(e.target.value)}
          className="input"
          min="0"
          max="4"
          required
        />
      </div>
    )}

    {willAttend !== null && !hasExistingRsvp && (
      <button
        type="button"
        className="change-option-button"
        onClick={() => {
          setWillAttend(null)
          setAdultGuests("")
          setChildGuests("")
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
        {submitInfo && (
          <p className="submit-info">{submitInfo}</p>
        )}
        {submitError && (
          <p className="submit-error">{submitError}</p>
        )}
      </>
    )}
    </form>
  </div>
)
}

export default HomeScreen