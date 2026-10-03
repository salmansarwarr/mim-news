import { useState, useEffect, useCallback } from 'react'
import { fetchPakistaniNews } from '../services/newsApi'

export default function usePakistaniNews({ autoFetch = true, query = '', number = 15 } = {}) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [fromCache, setFromCache] = useState(false)

  const loadNews = useCallback(async (force = false) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPakistaniNews({ forceRefresh: force, query, number })
      setNews(result.news)
      setFromCache(result.fromCache)
      setLastUpdated(result.lastUpdated)
    } catch (err) {
      setError(err.message || 'Failed to fetch Pakistani news')
    } finally {
      setLoading(false)
    }
  }, [query, number])

  useEffect(() => {
    if (autoFetch) {
      loadNews()
    }
  }, [autoFetch, loadNews])

  const refresh = useCallback(() => {
    return loadNews(true)
  }, [loadNews])

  return {
    news,
    loading,
    error,
    refresh,
    lastUpdated,
    fromCache,
  }
}
