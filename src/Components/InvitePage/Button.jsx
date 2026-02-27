import styles from "./Button.module.css"

function Button({ variant = "primary", children, className = "", href, ...props }) {
  const combinedClassName = `${styles.button} ${variant === "secondary" ? styles.secondary : styles.primary} ${className}`.trim()

  if (href) {
    return (
      <a className={combinedClassName} href={href} {...props}>
        <span>{children}</span>
      </a>
    )
  }

  return (
    <button className={combinedClassName} {...props}>
      <span>{children}</span>
    </button>
  )
}

export default Button