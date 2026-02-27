import { useState, useEffect } from "react"
import InfoCard from "./InfoCard"
import Button from "./Button"
import styles from "./MissionSection.module.css"

function MissionSection({ onConfirmPresence, onDecline }) {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 })

    useEffect(() => {
        const targetDate = new Date("2026-04-26T16:00:00")
        
        const updateCountdown = () => {
            const now = new Date()
            const diff = targetDate - now
            
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24))
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                setCountdown({ days, hours, minutes })
            }
        }
        
        updateCountdown()
        const interval = setInterval(updateCountdown, 60000)
        
        return () => clearInterval(interval)
    }, [])

    return (
        <section className={styles.section} aria-labelledby="mission-title">
            <h2 id="mission-title" className={styles.title}>
                Iniciando sequência de diversão...
            </h2>

            <div className={styles.grid}>
                <InfoCard
                    items={[
                        { label: "Data", value: "26 de Abril de 2026" },
                        { label: "Horário", value: "16h00" },
                        {
                            label: "Local",
                            value: "Jad Salão de Festa e Eventos | R. John Lenon, 1396 - Areias, São José - SC",
                        },
                    ]}
                />
            </div>

            <div className={styles.buttonGroup}>
                <Button
                    variant="primary"
                    className={styles.cta}
                    onClick={onConfirmPresence}
                    aria-label="Abrir formulário de confirmação de presença"
                >
                    CONFIRMAR PRESENÇA
                </Button>

                <button
                    type="button"
                    className={styles.declineBtn}
                    onClick={onDecline}
                    aria-label="Informar que não poderá comparecer"
                >
                    Não poderei ir
                </button>
            </div>
                    
            <p className={styles.countdown}>
                <h3 className={styles.countdownTitle}>Contagem regressiva...</h3>
                <span className={styles.countdownValue}>{countdown.days}</span> dias
                <span className={styles.countdownSep}>•</span>
                <span className={styles.countdownValue}>{countdown.hours}</span> horas
                <span className={styles.countdownSep}>•</span>
                <span className={styles.countdownValue}>{countdown.minutes}</span> min
            </p>
        </section>
    )
}

export default MissionSection