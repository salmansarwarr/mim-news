import { useParams, Link, Navigate } from 'react-router-dom'
import usePageMeta from '../components/usePageMeta'
import articleStore from '../store/articleStore'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-PK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ArticlePage() {
  const { id } = useParams()
  const article = articleStore.getById(id)

  // Only show published articles to the public
  if (!article || article.status !== 'published') {
    return <Navigate to="/404" replace />
  }

  usePageMeta(article.title, `${article.title} — MIM News. By ${article.author}. Published ${formatDate(article.publishedAt)}.`)

  const published = articleStore.getPublished()
  const related = published.filter(a => a.id !== id && a.category === article.category).slice(0, 3)
  const moreArticles = published.filter(a => a.id !== id && a.category !== article.category).slice(0, 3)

  return (
    <div className="w article-page">
      {/* Breadcrumb */}
      <nav className="article-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/category/${encodeURIComponent(article.category)}`}>{article.category}</Link>
        <span>›</span>
        <span>{article.title.length > 50 ? article.title.slice(0, 50) + '…' : article.title}</span>
      </nav>

      <div className="article-layout">
        {/* Main Article */}
        <article className="article-main" itemScope itemType="https://schema.org/NewsArticle">
          {/* Category & Status */}
          <div className="article-category-row">
            <Link to={`/category/${encodeURIComponent(article.category)}`} className="article-category-link">
              {article.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="article-title" itemProp="headline">{article.title}</h1>

          {/* Author & Meta */}
          <div className="article-byline">
            <div className="article-author-info">
              <div className="article-author-avatar" aria-hidden="true">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="article-author-name" itemProp="author">{article.author}</span>
                {article.bio && <span className="article-author-bio-short">{article.bio}</span>}
              </div>
            </div>
            <div className="article-meta-right">
              <time className="article-pub-date" itemProp="datePublished" dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>
          </div>

          {/* Featured Image */}
          {article.image && (
            <figure className="article-hero-figure">
              <img
                src={article.image}
                alt={article.title}
                className="article-hero-image"
                itemProp="image"
                loading="eager"
              />
            </figure>
          )}

          {/* Article Body */}
          <div
            className="article-body"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Footer */}
          <footer className="article-footer">
            <div className="article-footer-tags">
              <span className="article-footer-label">Filed under:</span>
              <Link to={`/category/${encodeURIComponent(article.category)}`} className="article-tag-link">
                {article.category}
              </Link>
            </div>
            <div className="article-footer-share">
              <span className="article-footer-label">Share:</span>
              <button
                className="share-btn"
                onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => alert('Link copied!'))}
                aria-label="Copy link"
              >
                🔗 Copy Link
              </button>
            </div>
          </footer>

          {/* Author Bio Box */}
          {article.bio && (
            <div className="article-author-box">
              <div className="article-author-box-avatar">{article.author.charAt(0).toUpperCase()}</div>
              <div className="article-author-box-info">
                <strong>About the Author</strong>
                <span className="article-author-box-name">{article.author}</span>
                <p>{article.bio}</p>
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="article-sidebar">
          {/* Related Articles */}
          {related.length > 0 && (
            <div className="sidebar-widget">
              <h2 className="sidebar-widget-title">More in {article.category}</h2>
              <div className="sidebar-article-list">
                {related.map(a => (
                  <Link key={a.id} to={`/article/${a.id}`} className="sidebar-article-item">
                    {a.image && <img src={a.image} alt="" className="sidebar-article-thumb" />}
                    <div className="sidebar-article-info">
                      <span className="sidebar-article-title">{a.title}</span>
                      <span className="sidebar-article-date">{formatDate(a.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other Articles */}
          {moreArticles.length > 0 && (
            <div className="sidebar-widget">
              <h2 className="sidebar-widget-title">Latest News</h2>
              <div className="sidebar-article-list">
                {moreArticles.map(a => (
                  <Link key={a.id} to={`/article/${a.id}`} className="sidebar-article-item">
                    {a.image && <img src={a.image} alt="" className="sidebar-article-thumb" />}
                    <div className="sidebar-article-info">
                      <span className="sidebar-article-title">{a.title}</span>
                      <span className="sidebar-article-meta">{a.category} · {formatDate(a.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <div className="sidebar-widget sidebar-cta">
            <h3>Got a Story?</h3>
            <p>Submit your article for editorial review and potential publication on MIM News.</p>
            <Link to="/submit" className="btn-primary btn-sm">Submit an Article →</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
