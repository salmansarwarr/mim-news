import { useParams, Link } from 'react-router-dom'
import usePageMeta from '../components/usePageMeta'
import articleStore from '../store/articleStore'
import NotFound from './NotFound'

const ALL_CATEGORIES = [
  'Politics', 'Business & Trade', 'Technology', 'Sports',
  'Karachi Metro', 'Health', 'Education', 'Arts & Culture',
  'Environment', 'International',
]

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function CategoryPage() {
  const { category } = useParams()
  const decodedCategory = decodeURIComponent(category)

  if (!ALL_CATEGORIES.includes(decodedCategory)) {
    return <NotFound />
  }

  const published = articleStore.getPublished()
  const articles = published.filter(a => a.category === decodedCategory)

  usePageMeta(
    `${decodedCategory} — MIM News`,
    `Latest ${decodedCategory} news and articles from MIM News Pakistan.`
  )

  const featuredArticle = articles[0]
  const restArticles = articles.slice(1)

  return (
    <div className="w category-page">
      {/* Category Header */}
      <div className="category-header">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>{decodedCategory}</span>
        </nav>
        <div className="category-header-inner">
          <span className="category-header-tag">CATEGORY</span>
          <h1 className="category-header-title">{decodedCategory}</h1>
          <p className="category-header-count">
            {articles.length === 0
              ? 'No articles published yet'
              : `${articles.length} article${articles.length !== 1 ? 's' : ''} published`}
          </p>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="category-empty">
          <span>📰</span>
          <h2>No articles yet</h2>
          <p>Be the first to submit an article in the {decodedCategory} category.</p>
          <Link to="/submit" className="btn-primary">Submit an Article →</Link>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featuredArticle && (
            <Link to={`/article/${featuredArticle.id}`} className="category-featured-card">
              {featuredArticle.image && (
                <div className="category-featured-image-wrap">
                  <img src={featuredArticle.image} alt={featuredArticle.title} className="category-featured-image" />
                </div>
              )}
              <div className="category-featured-content">
                <span className="category-featured-label">FEATURED</span>
                <h2 className="category-featured-title">{featuredArticle.title}</h2>
                <div className="category-featured-meta">
                  <span>By {featuredArticle.author}</span>
                  <span>·</span>
                  <time>{formatDate(featuredArticle.publishedAt)}</time>
                </div>
                <p className="category-featured-excerpt">
                  {featuredArticle.content
                    ?.replace(/<[^>]*>/g, '')
                    .slice(0, 200) + '…'}
                </p>
                <span className="category-read-more">Read Full Article →</span>
              </div>
            </Link>
          )}

          {/* Rest of articles */}
          {restArticles.length > 0 && (
            <div className="category-articles-grid">
              {restArticles.map(article => (
                <Link key={article.id} to={`/article/${article.id}`} className="category-article-card">
                  {article.image && (
                    <div className="category-card-image-wrap">
                      <img src={article.image} alt={article.title} className="category-card-image" />
                    </div>
                  )}
                  <div className="category-card-content">
                    <h3 className="category-card-title">{article.title}</h3>
                    <div className="category-card-meta">
                      <span>By {article.author}</span>
                      <time>{formatDate(article.publishedAt)}</time>
                    </div>
                    <p className="category-card-excerpt">
                      {article.content?.replace(/<[^>]*>/g, '').slice(0, 120) + '…'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Other Categories */}
      <div className="category-other-wrap">
        <h2 className="category-other-title">Browse Other Categories</h2>
        <div className="category-chips">
          {ALL_CATEGORIES.filter(c => c !== decodedCategory).map(c => (
            <Link key={c} to={`/category/${encodeURIComponent(c)}`} className="category-chip">
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
