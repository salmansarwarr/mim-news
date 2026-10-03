import { Link } from 'react-router-dom'
import usePageMeta from '../components/usePageMeta'
import PageHeader from '../components/PageHeader'

export default function NotFound() {
  usePageMeta('Signal Lost | MIM News', '404 - Page not found')
  return (
    <>
      <PageHeader title="404 — Signal Lost" badge="ERROR 404">
        The requested transmission endpoint does not exist or has been relocated in the digital directory.
      </PageHeader>
      <div className="w sec" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{
          maxWidth: 480,
          margin: '0 auto',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: 36,
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            fontFamily: 'var(--fh)',
            fontSize: 72,
            fontWeight: 900,
            color: 'var(--red)',
            lineHeight: 1,
            marginBottom: 12
          }}>
            404
          </div>
          <p style={{ color: 'var(--mute)', marginBottom: 24, fontSize: 16 }}>
            Telemetry shows no active broadcast on this frequency. Return to headquarters to re-establish your data link.
          </p>
          <Link className="btn-cyber" to="/" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <span>RETURN TO HQ</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </>
  )
}
