import usePageMeta from '../components/usePageMeta'
import PageHeader from '../components/PageHeader'

// Set this to your real email before deploying
const MIM_EMAIL = 'info@mimnews.example'

export default function Contact() {
  usePageMeta('Contact | MIM News', 'Contact MIM News in Karachi for story tips, coverage and production enquiries.')

  function onSubmit(e) {
    e.preventDefault()
    const f = e.currentTarget.elements
    const v = k => encodeURIComponent(f[k].value)
    window.location.href = `mailto:${MIM_EMAIL}?subject=${v('topic')}%20-%20${v('name')}&body=${v('msg')}%0A%0A${v('name')}%20(${v('from')})`
  }

  return (
    <>
      <PageHeader title="Direct Transmission" badge="COMMUNICATIONS HUB">
        Submit story tips, request on-ground event coverage, or inquire about video production.
      </PageHeader>

      <div className="w sec">
        <div className="contact-layout">
          {/* Futuristic Terminal Form */}
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="terminal-status">STATUS: SECURE TERMINAL // READY</span>
            </div>

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="name-input">Sender Name / Entity</label>
                <input
                  id="name-input"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="e.g. Tariq Khan or Sindh Tech Forum"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email-input">Return Communications Email</label>
                <input
                  id="email-input"
                  name="from"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@organization.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="topic-select">Dispatch Classification</label>
                <select id="topic-select" name="topic">
                  <option>Urgent Story Tip</option>
                  <option>Civic &amp; Event Reporting Request</option>
                  <option>Press Release &amp; Official Wire</option>
                  <option>Editorial Feedback or Correction</option>
                  <option>General Media Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="msg-area">Transmission Details / Story Notes</label>
                <textarea
                  id="msg-area"
                  name="msg"
                  rows="6"
                  required
                  placeholder="Include dates, coordinates/location in Karachi, involved organizations, and media requirements..."
                ></textarea>
              </div>

              <button type="submit" className="btn-cyber">
                <span>TRANSMIT DISPATCH</span>
                <span>→</span>
              </button>
            </form>
          </div>

          {/* Telemetry & HQ Info Sidebar */}
          <div className="contact-sidebar">
            <div className="hq-card">
              <h3>
                <span className="live-beacon-dot"></span>
                BUREAU TELEMETRY
              </h3>
              <div className="hq-telemetry">
                <div className="hq-row">
                  <span className="hq-label">Central Newsroom</span>
                  <span className="hq-val">Karachi, Sindh, Pakistan</span>
                </div>
                <div className="hq-row">
                  <span className="hq-label">Geographic Coordinates</span>
                  <span className="hq-val">24.8607° N, 67.0011° E</span>
                </div>
                <div className="hq-row">
                  <span className="hq-label">Direct Editorial Ingestion</span>
                  <span className="hq-val" style={{ color: 'var(--red)', fontWeight: 600 }}>info@mimnews.example</span>
                </div>
                <div className="hq-row">
                  <span className="hq-label">Field Response Standard</span>
                  <span className="hq-val">Within 2 hours for verified urgent alerts</span>
                </div>
              </div>
            </div>

            <div className="hq-card" style={{ background: 'var(--red-light)', borderColor: 'rgba(155, 28, 36, 0.25)' }}>
              <h4 style={{ fontFamily: 'var(--ftech)', fontSize: 13, color: 'var(--red)', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>
                SECURE SOURCE PROTOCOL
              </h4>
              <p style={{ fontSize: 13.5, color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
                Submitting opens your secure mail client pre-addressed to the MIM News editorial desk. Whistleblower documents and sensitive ground tips are protected under strict journalistic privacy guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
