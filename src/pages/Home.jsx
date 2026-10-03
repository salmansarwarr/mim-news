import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageMeta from '../components/usePageMeta'
import NewsCard from '../components/NewsCard'
import ArticleModal from '../components/ArticleModal'
import usePakistaniNews from '../hooks/usePakistaniNews'
import { stories as fallbackStories } from '../data'

export default function Home() {
  usePageMeta(
    'MIM News — Daily Pakistan News Wire',
    'Real-time daily news reports, breaking headlines, politics, business and metropolitan coverage from Karachi and across Pakistan.'
  )

  const [activeArticle, setActiveArticle] = useState(null)
  const { news: liveNews, loading } = usePakistaniNews({ number: 12 })

  // Use real news from World News API, or high-quality fallbacks if still connecting
  const allNews = liveNews && liveNews.length > 0 ? liveNews : fallbackStories

  // Real Top Story (Lead Article)
  const topStory = allNews[0]
  // Real Headlines for Radar Sidebar
  const radarHeadlines = allNews.slice(1, 5)
  // Real Feed Grid for Today's News
  const todayDispatches = allNews.slice(5, 11)

  return (
    <>
      <div className="w">
        {/* Futuristic Real News Hero Section */}
        <section className="hero-wrap">
          <div className="hero">
            {/* Top Breaking Story Lead Card (100% Real News) */}
            {topStory && (
              <div
                className="lead-card"
                onClick={() => setActiveArticle(topStory)}
                tabIndex={0}
                role="button"
                aria-label={`Read Top Story: ${topStory.title}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveArticle(topStory)
                  }
                }}
                style={{
                  backgroundImage: topStory.image ? `linear-gradient(to top, rgba(20, 3, 5, 0.95) 0%, rgba(30, 4, 7, 0.72) 45%, rgba(120, 19, 26, 0.4) 100%), url(${topStory.image})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* HUD Viewfinder Corner Brackets */}
                <div className="hud-corner hud-tl" aria-hidden="true"></div>
                <div className="hud-corner hud-tr" aria-hidden="true"></div>
                <div className="hud-corner hud-bl" aria-hidden="true"></div>
                <div className="hud-corner hud-br" aria-hidden="true"></div>

                <div className="lead-content">
                  <div className="lead-telemetry">
                    <span className="tag-futuristic">
                      <span className="live-beacon-dot"></span>
                      {topStory.source ? `TOP WIRE // ${topStory.source.toUpperCase()}` : 'TOP STORY'}
                    </span>
                    <span className="telemetry-meta">
                      LOC: <span>{topStory.location || 'PAKISTAN'}</span> // {topStory.time || 'LIVE'}
                    </span>
                  </div>

                  <h1>{topStory.title}</h1>
                  <p>{topStory.text}</p>

                  <div className="lead-footer">
                    <div className="lead-stats">
                      <span>SOURCE: <b>{topStory.source || 'VERIFIED WIRE'}</b></span>
                      <span>STATUS: <b>VERIFIED</b></span>
                      {topStory.author && <span>BY: <b>{topStory.author}</b></span>}
                    </div>
                    <span style={{ fontFamily: 'var(--ftech)', color: '#ffffff', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em' }}>
                      READ FULL REPORT →
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* High-Tech Radar Sidebar - Real-Time Headlines */}
            <aside className="side">
              <div className="side-header">
                <h2>HEADLINES</h2>
                <span className="radar-telemetry">
                  {loading ? 'SYNCING WIRE...' : 'LIVE PK RADAR'}
                </span>
              </div>
              <div className="stream-list">
                {radarHeadlines.map((story, i) => (
                  <div
                    className="stream-item"
                    key={story.id || i}
                    onClick={() => setActiveArticle(story)}
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                    role="button"
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveArticle(story)
                      }
                    }}
                  >
                    <div className="stream-meta">
                      <span className="stream-badge">{story.source || story.kind || 'WIRE'}</span>
                      <span>//</span>
                      <span className="stream-time">{story.time || 'TODAY'}</span>
                    </div>
                    <h3>{story.title}</h3>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* Real Daily News Dispatches Section */}
        {todayDispatches.length > 0 && (
          <section className="sec">
            <div className="sec-divider"></div>
            <div className="sh">
              <div className="sh-left">
                <span className="sh-glow-bar"></span>
                <h2>TODAY IN PAKISTAN</h2>
              </div>
              <Link className="sh-action" to="/news">
                <span>VIEW FULL NEWS WIRE</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid">
              {todayDispatches.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onSelect={(a) => setActiveArticle(a)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Real Journalism & Coverage Standards Section */}
        <section className="sec">
          <div className="sec-divider"></div>
          <div className="sh">
            <div className="sh-left">
              <span className="sh-glow-bar"></span>
              <h2>EDITORIAL &amp; NEWS DESK</h2>
            </div>
            <span className="telemetry-meta" style={{ color: 'var(--mute)' }}>
              NETWORK PROTOCOL // <span style={{ color: 'var(--red)' }}>FACT-CHECKED WIRE</span>
            </span>
          </div>

          <div className="capabilities-grid">
            <div className="cap-card">
              <div className="cap-header">
                <div className="cap-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3>Real-Time Wire Syndication</h3>
              </div>
              <p>
                MIM News aggregates, filters, and monitors verified daily reporting across major Pakistani news bureaus. Automated datastreams ensure readers receive immediate alerts on national developments, economic shifts, transit policies, and urban affairs.
              </p>
              <div className="cap-tags">
                <span className="cap-chip">Automated PK Ingestion</span>
                <span className="cap-chip">Multi-Source Verification</span>
                <span className="cap-chip">Publisher Attribution</span>
                <span className="cap-chip">Live Timestamp Tracking</span>
              </div>
            </div>

            <div className="cap-card">
              <div className="cap-header">
                <div className="cap-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3>Karachi &amp; Regional Focus</h3>
              </div>
              <p>
                Specialized metropolitan focus covering Karachi and the Sindh corridor: infrastructure developments, municipal initiatives, port telemetry, industrial sectors, and civic events reported without bias or sensationalism.
              </p>
              <div className="cap-tags">
                <span className="cap-chip">Metropolitan Karachi</span>
                <span className="cap-chip">Port &amp; Maritime Wire</span>
                <span className="cap-chip">Civic Infrastructure</span>
                <span className="cap-chip">Community Voice</span>
              </div>
            </div>
          </div>

          {/* Metric Telemetry Strip */}
          <div className="metrics-strip">
            <div className="metric-box">
              <div className="metric-num">24/7</div>
              <div className="metric-label">Live Wire Active</div>
            </div>
            <div className="metric-box">
              <div className="metric-num">100%</div>
              <div className="metric-label">Real News Feeds</div>
            </div>
            <div className="metric-box">
              <div className="metric-num">DAILY</div>
              <div className="metric-label">Pakistani Reports</div>
            </div>
            <div className="metric-box">
              <div className="metric-num">SECURE</div>
              <div className="metric-label">Direct Tip Terminal</div>
            </div>
          </div>
        </section>
      </div>

      {/* Organization Mission Section */}
      <section className="mission">
        <div className="w mission-inner">
          <span className="mission-tag">
            <span className="live-beacon-dot"></span>
            ORGANIZATION MISSION
          </span>
          <h2>To inform, document, and connect communities.</h2>
          <p>
            MIM News is committed to transparent reporting, daily news accuracy, and unbiased coverage of Pakistani society and metropolitan life.
          </p>
        </div>
      </section>

      {/* Real Article Modal Reader */}
      {activeArticle && (
        <ArticleModal article={activeArticle} onClose={() => setActiveArticle(null)} />
      )}
    </>
  )
}
