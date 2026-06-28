import vinylBg from '../assets/vinyl-bg.svg'
import '../styles/Header.css'

export default function Header() {
  return (
    <header className="header" style={{ backgroundImage: `url(${vinylBg})` }}>
      <span className="header-title">
        COLLECTION <span className="header-title-accent">ORGANIZER</span>
      </span>
    </header>
  )
}
