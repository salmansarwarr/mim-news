import { useEffect } from 'react'

export default function ArticleModal({ article, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!article) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={article.title}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 780 }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="live-beacon-dot"></span>
            <span className="k" style={{ fontSize: 13 }}>{article.source || 'PAKISTAN WIRE'}</span>
            <span style={{
              fontFamily: 'var(--ftech)',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--red)',
              background: 'var(--red-light)',
              padding: '2px 8px',
              borderRadius: 3
            }}>{article.kind || 'National'}</span>
            <span style={{ fontFamily: 'var(--ftech)', fontSize: 12, color: 'var(--mute)' }}>
              {article.time || 'Recent'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close article modal">✕</button>
        </div>

        {/* Modal Image (if available) */}
        {article.image && (
          <div style={{ maxHeight: 340, overflow: 'hidden', background: '#0a0507', borderBottom: '1px solid var(--line)' }}>
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', height: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}

        {/* Modal Article Content */}
        <div className="modal-body" style={{ maxHeight: 'calc(85vh - 200px)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <span style={{
              fontFamily: 'var(--ftech)',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--red)',
              background: 'var(--red-light)',
              padding: '3px 10px',
              borderRadius: 4
            }}>
              {article.location || 'Pakistan'}
            </span>
            <span style={{ fontFamily: 'var(--ftech)', fontSize: 12, color: 'var(--mute)' }}>
              {article.author ? `By ${article.author}` : article.source}
              {article.publishDate ? ` • ${new Date(article.publishDate.replace(' ', 'T') + 'Z').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.15, marginBottom: 16, color: 'var(--ink-heading)' }}>
            {article.title}
          </h2>

          <div style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--ink-secondary)' }}>
            {article.fullText || article.text}
          </div>

          {/* Full-content CTA — Newsdata.io free plan only provides article summary */}
          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'var(--red-light)',
            border: '1px solid color-mix(in srgb, var(--red) 25%, transparent)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: 20 }}>📰</span>
            <span style={{ fontFamily: 'var(--ftech)', fontSize: 13, color: 'var(--red)', fontWeight: 700, flex: 1 }}>
              This is a summary preview. Read the complete story on {article.source || 'the publisher\'s website'}.
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            marginTop: 26,
            paddingTop: 18,
            borderTop: '1px solid var(--line)'
          }}>
            <span style={{ fontFamily: 'var(--ftech)', fontSize: 12, color: 'var(--mute)' }}>
              AUTHENTICATED WIRE DISPATCH // NEWSDATA.IO
            </span>

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber"
                style={{ padding: '10px 20px', fontSize: 16 }}
              >
                <span>OPEN ORIGINAL ARTICLE ON {article.source?.toUpperCase() || 'PUBLISHER'}</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
