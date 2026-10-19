import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/icons/ArrowLeft'

import styles from './BackLink.module.css'

export default function BackLink ({ to="/", label="← Tillbaka" }) {
  return (
    <div className={styles.backLink}>
      <Link to={to} aria-label={label}>
        <ArrowLeftIcon size={20} />
        <span>{label}</span>
      </Link>
    </div>
  )
}
