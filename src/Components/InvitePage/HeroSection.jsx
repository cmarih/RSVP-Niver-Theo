import styles from "./HeroSection.module.css"

function HeroSection({ showSubtitle = true }) {
  return (
    <header className={styles.hero}>
      <div className={styles.mediaWrap}>
        <img
          className={styles.heroImage}
          src="/img/icone-2.png"
          alt="Théo Astro Bot em traje espacial"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>THÉO</h1>
        <h1 className={styles.title2}>6 ANOS</h1>
      </div>
      {showSubtitle && (
        <p className={styles.subtitle}>
          O Astro Théo ativou o modo festa. Preparado para jogar essa aventura?
        </p>
      )}
    </header>
  )
}

export default HeroSection