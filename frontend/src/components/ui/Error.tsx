import { WarningIcon } from "@phosphor-icons/react";

import styles from './Error.module.css'

export default function Error({ message }: { message: string }) {
  return (
    <div className={styles.errorContainer}>
      <WarningIcon />
      <p 
        className={styles.errorMessage}
        role="alert"
      >
        {message}
      </p>
    </div>
  )
}
