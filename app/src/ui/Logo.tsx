import { Link } from 'react-router-dom'
import { config } from '../config'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${config.nombreApp}: ir al inicio`}>
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 15 16 5l12 10" />
        <path d="M8 13v14h16V13" />
        <path d="M14 18h4v4h-4z" fill="#f2b84b" stroke="none" />
      </svg>
      <span>Lo que no<br />te enseñaron</span>
    </Link>
  )
}
