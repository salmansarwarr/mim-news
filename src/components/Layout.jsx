import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import usePakistaniNews from '../hooks/usePakistaniNews'

const FALLBACK_ITEMS = [
  'PAKISTAN WIRE: Real-time news dispatches updated continuously from verified publishers',
  'KARACHI METRO: Ground news coverage, infrastructure and metropolitan updates active',
  'NATIONAL DESK: Economic developments, political reports and civic reporting',
]

const LINKS = [
  ['/', 'Home', '01'],
  ['/news', 'Daily News', '02'],
  ['/submit', 'Submit Article', '03'],
  ['/about', 'About', '04'],
  ['/contact', 'Contact', '05'],
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [clock, setClock] = useState('')
  const { pathname } = useLocation()
  const { news } = usePakistaniNews({ number: 10 })

  // Build ticker items from real daily Pakistani news headlines
  const tickerItems = news && news.length > 0
    ? news.map(item => `${item.source ? item.source.toUpperCase() + ': ' : ''}${item.title}`)
    : FALLBACK_ITEMS

  // Real-time Pakistan Standard Time (PKT) clock
  useEffect(() => {
    function updateClock() {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const dateStr = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Karachi',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase()
      setClock(`PKT ${timeStr} // ${dateStr}`)
    }
    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {/* High-Tech Telemetry & Live Real News Ticker */}
      <div className="tick-wrap">
        <div className="tick-telemetry">
          <span className="live-beacon">
            <span className="live-beacon-dot"></span>
            LIVE PK WIRE
          </span>
        </div>
        <div className="tick">
          <div className="tick-inner">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span className="tick-item" key={i}>
                <span className="tick-separator">///</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="tick-clock">
          <b>{clock || 'PKT // KARACHI'}</b>
        </div>
      </div>

      {/* Futuristic Main Header */}
      <header>
        <div className="w bar">
          <div className="brand-wrap">
            <Link to="/" className="logo-hud" aria-label="MIM News Home">
              <img className="logo" alt="MIM News HD" src="/assets/logo.jpg" width="84" height="64" />
            </Link>
            <div className="brand-telemetry">
              <span className="brand-tagline">MIM NEWS • WIRE</span>
              <span className="brand-sub">Daily Pakistan News Network</span>
            </div>
          </div>

          <button
            className="menu"
            aria-expanded={open}
            aria-controls="nv"
            onClick={() => setOpen(o => !o)}
          >
            {open ? '✕ CLOSE' : '☰ MENU'}
          </button>

          <nav id="nv" aria-label="Main Navigation" className={open ? 'open' : ''}>
            {LINKS.map(([to, label, num]) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) => `nav-link ${isActive ? 'on' : ''}`}
              >
                <span className="nav-link-num">{num}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <div className="waveform" title="Live Broadcast Frequency Active">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
            <Link to="/news" className="signal-pill" title="Read Real Daily Pakistan News">
              <span className="live-beacon-dot"></span>
              <span>DAILY WIRE</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main>
        <Outlet />
      </main>

      {/* Futuristic Footer */}
      <footer>
        <div className="w footer-inner">
          <div className="footer-brand">
            <img alt="MIM News HD" src="/assets/logo.jpg" width="71" height="54" />
            <div className="footer-brand-text">
              <span className="footer-brand-title">MIM NEWS NETWORK</span>
              <span>Daily Pakistan News Coverage, Ground Reporting &amp; Wire Distribution</span>
              <span className="footer-telemetry-tag">WORLD NEWS API INTEGRATED // REAL-TIME DISPATCHES</span>
            </div>
          </div>
          <div className="footer-nav">
            {LINKS.map(([to, label]) => (
              <Link key={to} to={to}>{label}</Link>
            ))}
            <Link to="/admin" style={{ opacity: 0.55, fontSize: 12 }}>Admin</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
