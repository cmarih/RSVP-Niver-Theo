import HeroSection from "./HeroSection"
import MissionSection from "./MissionSection"
import styles from "./InvitePage.module.css"

function InvitePage({ onConfirmPresence }) {
  return (
    <main className={styles.page}>
      <div className={styles.starLayer} aria-hidden="true" />
      <div className={styles.starLayerSecondary} aria-hidden="true" />

      <span className={`${styles.decorative} ${styles.planetA}`} aria-hidden="true" />
      <span className={`${styles.decorative} ${styles.planetB}`} aria-hidden="true" />
      <span className={`${styles.decorative} ${styles.asteroid}`} aria-hidden="true" />

      <img 
        src="/img/logo.png" 
        alt="Logo" 
        className={styles.pageLogo}
      />

      <div className={styles.content}>
        <HeroSection />
        <MissionSection onConfirmPresence={onConfirmPresence} />
      </div>
    </main>
  )
}

export default InvitePage