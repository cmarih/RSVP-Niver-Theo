import InfoCard from "./InfoCard"
import Button from "./Button"
import styles from "./MissionSection.module.css"

function MissionSection({ onConfirmPresence }) {
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

            <Button
                variant="primary"
                className={styles.cta}
                onClick={onConfirmPresence}
                aria-label="Abrir formulário de confirmação de presença"
            >
                CONFIRMAR PRESENÇA
            </Button>
        </section>
    )
}

export default MissionSection