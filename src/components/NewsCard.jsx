export default function NewsCard({ article, onSelect }) {
  if (!article) return null

  return (
    <article
      className="card"
      onClick={() => onSelect && onSelect(article)}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={e => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect(article)
        }
      }}
    >
      <div className="th" style={{ position: 'relative' }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        <span className="th-badge-top">{article.source || 'PAKISTAN WIRE'}</span>
        {article.time && <span className="th-duration">{article.time}</span>}
      </div>

      <div className="b">
        <div className="card-meta-line">
          <span className="k">{article.kind || 'National'}</span>
          <span className="card-loc">{article.location || 'Pakistan'}</span>
        </div>

        <h3>{article.title}</h3>
        <p>{article.text}</p>

        <div className="card-footer-telemetry">
          <span>{article.author ? `By ${article.author}` : (article.source || 'Verified Story')}</span>
          <span style={{ color: 'var(--red)', fontWeight: 700 }}>READ REPORT →</span>
        </div>
      </div>
    </article>
  )
}
