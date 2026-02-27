import styles from "./InfoCard.module.css"

function InfoCard({ items }) {
  return (
    <article className={styles.card}>
      <div className={styles.stack}>
        {items.map((item) => (
          <div className={styles.row} key={item.label}>
            <h3 className={styles.label}>{item.label}</h3>
            <p className={styles.value}>{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  )
}

export default InfoCard