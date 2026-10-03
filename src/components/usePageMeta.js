import { useEffect } from 'react'

export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    const set = (sel, v) => document.querySelector(sel)?.setAttribute('content', v)
    set('meta[name="description"]', description)
    set('meta[property="og:title"]', title)
  }, [title, description])
}
