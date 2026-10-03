import usePageMeta from '../components/usePageMeta'
import PageHeader from '../components/PageHeader'

const SPECS = [
  { label: 'Daily Pakistan News Wire', desc: 'Real-time wire integration via World News API' },
  { label: 'Breaking News & Fact-Checking', desc: 'Multi-source corroborated reporting from top bureaus' },
  { label: 'Metropolitan Karachi Desk', desc: 'Urban transit, municipal initiatives, and civic affairs' },
  { label: 'Business & Economic Telemetry', desc: 'Market indicators, trade policy, and port updates' },
  { label: 'On-Ground Field Reporting', desc: 'Independent field reporters across metropolitan sectors' },
  { label: 'Digital Publishing & Archiving', desc: 'Instant syndication across web and mobile platforms' },
]

export default function About() {
  usePageMeta('About | MIM News', 'About MIM News, a Karachi-based news and media organization.')

  return (
    <>
      <PageHeader title="About MIM News" badge="EDITORIAL DOSSIER">
        A Karachi-based journalism and digital news network delivering verified daily Pakistani reporting.
      </PageHeader>

      <div className="w sec">
        <div className="about-grid">
          <div className="about-prose">
            <div className="about-lead-box">
              MIM News is built on a clear imperative: deliver verified ground truth, report real-time Pakistani news without sensationalism, and connect communities through reliable journalism.
            </div>
            <p>
              Operating from Karachi, MIM News combines on-ground reporting with automated national wire syndication powered by the World News API. We monitor, aggregate, and publish verified news reports covering national politics, trade, economy, civic initiatives, and community life.
            </p>
            <p>
              Our editorial standards prioritize corroborated facts, attribution to accredited publishers (including Dawn, The News, and Express Tribune), and transparent daily updates.
            </p>
            <p>
              From the industrial maritime ports to municipal administrative zones, our reporters and automated data links deliver rapid-fire intelligence on the stories shaping Pakistan.
            </p>
          </div>

          <div className="specs-card">
            <h3>NEWSROOM OPERATIONS</h3>
            <ul className="specs-list">
              {SPECS.map(item => (
                <li className="spec-row" key={item.label}>
                  <span className="spec-icon">▸</span>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--ink-heading)' }}>{item.label}</strong>
                    <span style={{ fontSize: 12, color: 'var(--mute)' }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="mission">
        <div className="w mission-inner">
          <span className="mission-tag">
            <span className="live-beacon-dot"></span>
            OUR MISSION
          </span>
          <h2>To inform, document, and connect communities.</h2>
          <p>
            Through transparent journalism, verified fact streams, and daily ground presence, we bridge the gap between citizen reality and national media.
          </p>
        </div>
      </section>
    </>
  )
}
