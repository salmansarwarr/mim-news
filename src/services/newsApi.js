// Newsdata.io Service for Daily Pakistani News
const API_BASE = 'https://newsdata.io/api/1'
const CACHE_KEY = 'mim_pakistan_news_cache_v2'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export function getApiKey() {
  return (
    import.meta.env.VITE_NEWS_DATA_IO_API_KEY ||
    import.meta.env.NEWS_DATA_IO_API_KEY ||
    'pub_0d5ed3042f0c4912adec4ff52eefa068'
  )
}

function formatRelativeTime(dateString) {
  try {
    // Newsdata.io format: "2026-10-03 06:28:36"
    const pub = new Date(dateString.replace(' ', 'T') + 'Z')
    const now = new Date()
    const diffMs = now - pub
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  } catch {
    return 'Recent'
  }
}

function resolveSourceName(article) {
  if (article.source_name) return article.source_name
  try {
    const hostname = new URL(article.link).hostname.replace('www.', '')
    if (hostname.includes('dawn.com')) return 'Dawn'
    if (hostname.includes('tribune.com.pk')) return 'Express Tribune'
    if (hostname.includes('thenews.com.pk')) return 'The News'
    if (hostname.includes('geo.tv')) return 'Geo News'
    if (hostname.includes('nation.com.pk')) return 'The Nation'
    if (hostname.includes('arynews.tv')) return 'ARY News'
    if (hostname.includes('samaa.tv')) return 'Samaa TV'
    if (hostname.includes('dunyanews.tv')) return 'Dunya News'
    return hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1)
  } catch {
    return 'Pakistan News'
  }
}

function mapCategory(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return 'National'
  const cats = categories.map(c => c.toLowerCase())
  if (cats.includes('sports')) return 'Sports'
  if (cats.includes('business') || cats.includes('economy')) return 'Business & Trade'
  if (cats.includes('technology') || cats.includes('science')) return 'Technology'
  if (cats.includes('politics') || cats.includes('government')) return 'Politics'
  if (cats.includes('entertainment')) return 'Entertainment'
  if (cats.includes('health')) return 'Health'
  if (cats.includes('world')) return 'World'
  return 'National'
}

function formatArticle(raw) {
  const source = resolveSourceName(raw)
  const time = formatRelativeTime(raw.pubDate)

  // Category from API category array, refined by keywords
  const titleLower = (raw.title || '').toLowerCase()
  let kind = mapCategory(raw.category)

  // Keyword overrides for finer granularity
  if (kind === 'National') {
    if (titleLower.includes('karachi') || titleLower.includes('sindh')) kind = 'Karachi Metro'
    else if (
      titleLower.includes('economy') ||
      titleLower.includes('market') ||
      titleLower.includes('rupee') ||
      titleLower.includes('trade') ||
      titleLower.includes('import')
    ) kind = 'Business & Trade'
    else if (titleLower.includes('court') || titleLower.includes('justice')) kind = 'Law & Order'
    else if (titleLower.includes('pm ') || titleLower.includes('government') || titleLower.includes('minister') || titleLower.includes('assembly')) kind = 'Politics'
    else if (titleLower.includes('cricket') || titleLower.includes('match') || titleLower.includes('cup')) kind = 'Sports'
    else if (titleLower.includes('tech') || titleLower.includes('ai ') || titleLower.includes('telecom')) kind = 'Technology'
  }

  // Description from Newsdata.io (it's their "summary" field)
  const text = raw.description
    ? raw.description.slice(0, 250) + (raw.description.length > 250 ? '...' : '')
    : ''

  return {
    id: raw.article_id || String(Math.random()),
    title: raw.title,
    text,
    fullText: raw.description,
    image: raw.image_url || null,
    url: raw.link,
    publishDate: raw.pubDate,
    time,
    source,
    author: Array.isArray(raw.creator) && raw.creator.length > 0
      ? raw.creator[0]
      : source,
    kind,
    tag: `LIVE PK // ${kind.toUpperCase()}`,
    location: titleLower.includes('karachi')
      ? 'Karachi, PK'
      : titleLower.includes('lahore')
        ? 'Lahore, PK'
        : titleLower.includes('islamabad')
          ? 'Islamabad, PK'
          : 'Pakistan',
  }
}

/**
 * Fetch daily Pakistani news from Newsdata.io
 * @param {Object} options
 * @param {boolean} options.forceRefresh - Bypass cache
 * @param {string} options.query - Optional keyword query
 * @param {number} options.size - Number of items per page (max 10 on free plan)
 */
export async function fetchPakistaniNews({ forceRefresh = false, query = '', number = 10 } = {}) {
  const apiKey = getApiKey()

  // Check cache first
  if (!forceRefresh && !query) {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY)
      if (cachedStr) {
        const cached = JSON.parse(cachedStr)
        const age = Date.now() - cached.timestamp
        if (age < CACHE_TTL && Array.isArray(cached.news) && cached.news.length > 0) {
          return { news: cached.news, fromCache: true, lastUpdated: new Date(cached.timestamp) }
        }
      }
    } catch (err) {
      console.warn('Could not read from news cache:', err)
    }
  }

  // Newsdata.io free plan: country=pk, language=en, size up to 10
  const params = new URLSearchParams({
    apikey: apiKey,
    country: 'pk',
    language: 'en',
    size: String(Math.min(number, 10)), // free plan cap
  })

  if (query.trim()) {
    params.set('q', query.trim())
  }

  const endpoint = `${API_BASE}/news?${params.toString()}`

  try {
    const res = await fetch(endpoint)
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Newsdata.io returned status ${res.status}: ${errText}`)
    }

    const data = await res.json()
    if (data.status !== 'success') {
      throw new Error(`Newsdata.io error: ${data.message || JSON.stringify(data)}`)
    }

    const rawList = Array.isArray(data.results) ? data.results : []
    // Filter out articles with no title or description
    const filtered = rawList.filter(a => a.title && a.description)
    const formattedNews = filtered.map(formatArticle)

    // Store to cache
    if (!query && formattedNews.length > 0) {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), news: formattedNews })
        )
      } catch (err) {
        console.warn('Could not write to news cache:', err)
      }
    }

    return { news: formattedNews, fromCache: false, lastUpdated: new Date() }
  } catch (error) {
    console.error('Failed to fetch from Newsdata.io:', error)

    // Fallback to cache if available
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY)
      if (cachedStr) {
        const cached = JSON.parse(cachedStr)
        if (Array.isArray(cached.news) && cached.news.length > 0) {
          return {
            news: cached.news,
            fromCache: true,
            error: error.message,
            lastUpdated: new Date(cached.timestamp),
          }
        }
      }
    } catch {
      // ignore
    }

    throw error
  }
}
