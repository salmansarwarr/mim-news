import { useState, useMemo } from 'react'
import usePageMeta from '../components/usePageMeta'
import PageHeader from '../components/PageHeader'
import ArticleModal from '../components/ArticleModal'
import usePakistaniNews from '../hooks/usePakistaniNews'
import { stories as fallbackStories } from '../data'

const CATEGORIES = ['All', 'Politics', 'Business & Trade', 'Karachi Metro', 'Sports', 'Technology']

export default function News() {
  usePageMeta('Daily Pakistan News Wire | MIM News', 'Live daily news reports, headlines and breaking coverage from Pakistan.')
  
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const { news: liveNews, loading, error, refresh, lastUpdated, fromCache } = usePakistaniNews({ number: 20 })

  // Use live daily Pakistani news if available, or fallback to data.js stories
  const allArticles = liveNews && liveNews.length > 0 ? liveNews : fallbackStories

  const filteredStories = useMemo(() => {
    return allArticles.filter(story => {
      const storyKind = story.kind || 'National'
      const matchesCategory =
        activeCategory === 'All' ||
        storyKind.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4)) ||
        (activeCategory === 'Karachi Metro' && (story.title.toLowerCase().includes('karachi') || story.location?.toLowerCase().includes('karachi')))
      
      const matchesSearch =
        !searchQuery.trim() ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.text && story.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (story.source && story.source.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return matchesCategory && matchesSearch
    })
  }, [allArticles, activeCategory, searchQuery])

  return (
    <>
      <PageHeader title="Daily Pakistan News Wire" badge="NEWSDATA.IO">
        Real-time daily news reports, headlines, politics, business and metropolitan coverage across Pakistan.
      </PageHeader>

      <div className="w sec">
        {/* Telemetry Status & Manual Sync Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          padding: '12px 20px',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="live-beacon-dot"></span>
            <span style={{ fontFamily: 'var(--ftech)', fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>
              LIVE PAKISTAN FEED
            </span>
            <span style={{ fontFamily: 'var(--ftech)', fontSize: 12, color: 'var(--mute)' }}>
              // SOURCE: NEWSDATA.IO
            </span>
            {lastUpdated && (
              <span style={{ fontFamily: 'var(--ftech)', fontSize: 11.5, color: 'var(--mute)', background: 'var(--red-light)', padding: '2px 8px', borderRadius: 4 }}>
                UPDATED: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {fromCache ? '(CACHED)' : '(FRESH)'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="chip-btn"
            style={{ padding: '6px 14px', fontSize: 12 }}
            title="Fetch latest headlines now"
          >
            {loading ? 'SYNCING WIRE...' : '🔄 REFRESH FEED'}
          </button>
        </div>

        {/* Interactive Filter & Search Bar */}
        <div className="filter-bar">
          <div className="chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`chip-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {activeCategory === cat && <span className="live-beacon-dot" style={{ width: 6, height: 6 }}></span>}
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search daily Pakistani wire..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Filter news stories"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && allArticles.length === 0 && (
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            padding: 48,
            textAlign: 'center',
            color: 'var(--ink)'
          }}>
            <div className="live-beacon-dot" style={{ width: 14, height: 14, margin: '0 auto 16px' }}></div>
            <h3 style={{ fontSize: 24, marginBottom: 8 }}>Fetching Daily Pakistani News...</h3>
            <p style={{ color: 'var(--mute)', fontFamily: 'var(--ftech)' }}>Connecting to Newsdata.io Pakistan feed...</p>
          </div>
        )}

        {/* Stories List */}
        <div className="list">
          {filteredStories.length === 0 && !loading ? (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              padding: 40,
              textAlign: 'center',
              color: 'var(--mute)'
            }}>
              <p style={{ fontFamily: 'var(--ftech)', fontSize: 16 }}>No news dispatches found matching your search criteria.</p>
              <button
                className="chip-btn"
                style={{ marginTop: 14 }}
                onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredStories.map((s, index) => (
              <article
                className="item"
                key={s.id || s.title || index}
                onClick={() => setSelectedArticle(s)}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedArticle(s)
                  }
                }}
              >
                <div className="th">
                  {s.image ? (
                    <img
                      src={s.image}
                      alt={s.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : null}
                  <span className="th-badge-top">{s.source || s.tag || s.kind}</span>
                  {s.time && <span className="th-duration">{s.time}</span>}
                </div>
                <div className="item-content">
                  <div className="item-meta-top">
                    <span className="k">{s.kind || 'National Wire'}</span>
                    <span style={{ color: 'var(--mute)', fontSize: 12, fontFamily: 'var(--ftech)' }}>
                      {s.location || 'PAKISTAN'}
                    </span>
                    {s.source && (
                      <span style={{
                        background: 'var(--red-light)',
                        color: 'var(--red)',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: 3,
                        fontFamily: 'var(--ftech)'
                      }}>
                        {s.source}
                      </span>
                    )}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="item-footer">
                    <span>{s.author ? `By ${s.author}` : (s.reads || 'Daily Wire')}</span>
                    <span style={{ color: 'var(--red)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span>READ DISPATCH</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Real Article Modal Reader */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </>
  )
}
