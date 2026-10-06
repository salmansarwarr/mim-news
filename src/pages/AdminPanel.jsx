import { useState, useEffect, useCallback } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import usePageMeta from '../components/usePageMeta'
import articleStore from '../store/articleStore'

const CATEGORIES = [
  'Politics', 'Business & Trade', 'Technology', 'Sports',
  'Karachi Metro', 'Health', 'Education', 'Arts & Culture',
  'Environment', 'International',
]

const STATUS_LABELS = {
  pending: { label: 'Pending', color: 'status-pending' },
  approved: { label: 'Approved', color: 'status-approved' },
  rejected: { label: 'Rejected', color: 'status-rejected' },
  published: { label: 'Published', color: 'status-published' },
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PK', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Article Detail / Edit Modal ──────────────────────────────────────────────
function ArticleDetailModal({ article, onClose, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectNotes, setRejectNotes] = useState('')
  const [editForm, setEditForm] = useState({
    title: article.title,
    category: article.category,
    author: article.author,
    email: article.email,
    bio: article.bio || '',
    image: article.image || '',
    content: article.content,
  })
  const [saving, setSaving] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  function showMsg(msg) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 2500)
  }

  function handleEdit(field, val) {
    setEditForm(f => ({ ...f, [field]: val }))
  }

  async function saveEdits() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))
    articleStore.update(article.id, editForm)
    setSaving(false)
    setEditing(false)
    showMsg('Changes saved.')
    onRefresh()
  }

  function handleApprove() {
    articleStore.approve(article.id)
    showMsg('Article approved.')
    onRefresh()
    onClose()
  }

  function handleReject() {
    articleStore.reject(article.id, rejectNotes)
    setRejectModal(false)
    showMsg('Article rejected.')
    onRefresh()
    onClose()
  }

  function handlePublish() {
    articleStore.publish(article.id)
    showMsg('Article published!')
    onRefresh()
    onClose()
  }

  function handleUnpublish() {
    articleStore.unpublish(article.id)
    showMsg('Article unpublished.')
    onRefresh()
    onClose()
  }

  function handleDelete() {
    if (!window.confirm('Permanently delete this article? This cannot be undone.')) return
    articleStore.delete(article.id)
    onRefresh()
    onClose()
  }

  // Get current status (may have changed since opening)
  const currentArticle = articleStore.getById(article.id) || article
  const st = currentArticle.status

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Article details" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-panel admin-modal-panel">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-wrap">
            <span className={`status-badge ${STATUS_LABELS[st]?.color}`}>{STATUS_LABELS[st]?.label}</span>
            <h2 className="admin-modal-title">{currentArticle.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {actionMsg && <div className="admin-action-msg">{actionMsg}</div>}

        <div className="admin-modal-body">
          {/* Meta Info */}
          <div className="admin-article-meta-grid">
            <div className="admin-meta-item">
              <span className="admin-meta-label">Author</span>
              <span className="admin-meta-val">{currentArticle.author}</span>
            </div>
            <div className="admin-meta-item">
              <span className="admin-meta-label">Email</span>
              <a href={`mailto:${currentArticle.email}`} className="admin-meta-val admin-meta-link">{currentArticle.email}</a>
            </div>
            <div className="admin-meta-item">
              <span className="admin-meta-label">Category</span>
              <span className="admin-meta-val">{currentArticle.category}</span>
            </div>
            <div className="admin-meta-item">
              <span className="admin-meta-label">Submitted</span>
              <span className="admin-meta-val">{formatDate(currentArticle.submittedAt)}</span>
            </div>
            {currentArticle.publishedAt && (
              <div className="admin-meta-item">
                <span className="admin-meta-label">Published</span>
                <span className="admin-meta-val">{formatDate(currentArticle.publishedAt)}</span>
              </div>
            )}
            {currentArticle.bio && (
              <div className="admin-meta-item" style={{ gridColumn: '1/-1' }}>
                <span className="admin-meta-label">Author Bio</span>
                <span className="admin-meta-val">{currentArticle.bio}</span>
              </div>
            )}
          </div>

          {currentArticle.adminNotes && (
            <div className="admin-notes-box">
              <strong>Editorial Notes:</strong> {currentArticle.adminNotes}
            </div>
          )}

          {/* Status explanation & direct action helper */}
          {st === 'approved' && (
            <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#93c5fd', margin: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                ℹ️ <strong>Status: Approved (Staged)</strong><br />
                This article has passed editorial review. Click <strong>"🌐 Publish"</strong> below to make it visible on the Homepage, Category pages, and live URL.
              </div>
              <button className="btn-publish btn-sm" onClick={handlePublish} style={{ whiteSpace: 'nowrap' }}>
                🌐 Publish Now
              </button>
            </div>
          )}

          {st === 'published' && (
            <div style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.35)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#86efac', margin: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                ✅ <strong>Status: Live on Website</strong><br />
                Published at {formatDate(currentArticle.publishedAt)}. Visible to all readers.
              </div>
              <Link to={`/article/${currentArticle.id}`} target="_blank" className="btn-secondary btn-sm" style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                🔗 View on Website ↗
              </Link>
            </div>
          )}

          {st === 'pending' && (
            <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#fde047', margin: '14px 0' }}>
              ⏳ <strong>Status: Pending Review</strong> — Submitted by author. You can review the content, edit details, and Approve or Reject.
            </div>
          )}

          {/* Featured Image */}
          {currentArticle.image && !editing && (
            <div className="admin-article-image-wrap">
              <img src={currentArticle.image} alt="Featured" className="admin-article-image" />
            </div>
          )}

          {/* Content or Editor */}
          {editing ? (
            <div className="admin-edit-form">
              <h3 className="admin-edit-title">Edit Article</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input className="form-input" value={editForm.title} onChange={e => handleEdit('title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input form-select" value={editForm.category} onChange={e => handleEdit('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Author Name</label>
                  <input className="form-input" value={editForm.author} onChange={e => handleEdit('author', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Author Email</label>
                  <input className="form-input" type="email" value={editForm.email} onChange={e => handleEdit('email', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Author Bio</label>
                <textarea className="form-input form-textarea" rows={2} value={editForm.bio} onChange={e => handleEdit('bio', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Featured Image URL</label>
                <input className="form-input" type="url" value={editForm.image} onChange={e => handleEdit('image', e.target.value)} placeholder="https://..." />
                {editForm.image && <img src={editForm.image} alt="" className="edit-image-preview" />}
              </div>
              <div className="form-group">
                <label>Content (HTML)</label>
                <textarea
                  className="form-input form-textarea admin-content-editor"
                  rows={14}
                  value={editForm.content}
                  onChange={e => handleEdit('content', e.target.value)}
                />
              </div>
              <div className="admin-edit-actions">
                <button className="btn-primary" onClick={saveEdits} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="admin-article-content-view">
              <h3 className="admin-content-heading">Article Content</h3>
              <div
                className="article-body admin-article-body"
                dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              />
            </div>
          )}
        </div>

        {/* Action Bar */}
        {!editing && (
          <div className="admin-modal-actions">
            <div className="admin-modal-actions-left">
              <button className="btn-secondary" onClick={() => setEditing(true)}>
                ✏️ Edit
              </button>
              <button className="btn-danger-outline" onClick={handleDelete}>
                🗑 Delete
              </button>
            </div>
            <div className="admin-modal-actions-right">
              {st === 'pending' && (
                <>
                  <button className="btn-reject" onClick={() => setRejectModal(true)}>Reject</button>
                  <button className="btn-approve" onClick={handleApprove}>Approve</button>
                </>
              )}
              {st === 'approved' && (
                <>
                  <button className="btn-reject" onClick={() => setRejectModal(true)}>Reject</button>
                  <button className="btn-publish" onClick={handlePublish}>🌐 Publish</button>
                </>
              )}
              {st === 'rejected' && (
                <>
                  <button className="btn-approve" onClick={handleApprove}>Re-Approve</button>
                </>
              )}
              {st === 'published' && (
                <>
                  <button className="btn-secondary" onClick={handleUnpublish}>Unpublish</button>
                  <Link to={`/article/${currentArticle.id}`} target="_blank" className="btn-view-live">
                    🔗 View Live
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reject Notes Modal */}
      {rejectModal && (
        <div className="reject-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setRejectModal(false) }}>
          <div className="reject-modal">
            <h3>Reject Submission</h3>
            <p>Optionally add a note for the author explaining why the article was rejected.</p>
            <textarea
              className="form-input form-textarea"
              rows={4}
              placeholder="e.g. The article lacks sufficient sourcing and requires factual verification before resubmission."
              value={rejectNotes}
              onChange={e => setRejectNotes(e.target.value)}
              autoFocus
            />
            <div className="reject-modal-actions">
              <button className="btn-secondary" onClick={() => setRejectModal(false)}>Cancel</button>
              <button className="btn-reject" onClick={handleReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div className={`admin-stat-card admin-stat-${color}`}>
      <div className="admin-stat-icon">{icon}</div>
      <div className="admin-stat-num">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  usePageMeta('Admin Dashboard — MIM News', 'Secure editorial administration panel.')

  const { isAuthenticated, logout } = useAuth()
  const [articles, setArticles] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  const refresh = useCallback(() => {
    setArticles(articleStore.getAll())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Stats
  const stats = {
    total: articles.length,
    pending: articles.filter(a => a.status === 'pending').length,
    approved: articles.filter(a => a.status === 'approved').length,
    rejected: articles.filter(a => a.status === 'rejected').length,
    published: articles.filter(a => a.status === 'published').length,
  }

  // Filter
  const filtered = articles.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const TABS = [
    { key: 'all', label: 'All Articles', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'approved', label: 'Approved', count: stats.approved },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
    { key: 'published', label: 'Published', count: stats.published },
  ]

  return (
    <div className="admin-page">
      {/* Admin Header */}
      <div className="admin-topbar">
        <div className="admin-topbar-brand">
          <img src="/assets/logo.jpg" alt="MIM News" width="40" height="30" />
          <div>
            <span className="admin-topbar-title">MIM NEWS</span>
            <span className="admin-topbar-sub">Editorial Admin Panel</span>
          </div>
        </div>
        <div className="admin-topbar-actions">
          <button
            className="btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm('Reset all article data back to the default sample dataset?')) {
                articleStore.resetStore()
                refresh()
              }
            }}
            title="Reload full sample dataset with Pending, Approved, Rejected, and Published articles"
          >
            🔄 Reset Sample Data
          </button>
          <Link to="/" className="btn-secondary btn-sm" target="_blank">🌐 View Site</Link>
          <Link to="/submit" className="btn-secondary btn-sm" target="_blank">📝 Submit Form</Link>
          <button className="btn-logout" onClick={logout}>Sign Out</button>
        </div>
      </div>

      <div className="admin-content">
        {/* Stats Row */}
        <div className="admin-stats-row">
          <StatCard label="Total Submissions" value={stats.total} color="total" icon="📋" />
          <StatCard label="Pending Review" value={stats.pending} color="pending" icon="⏳" />
          <StatCard label="Approved" value={stats.approved} color="approved" icon="✅" />
          <StatCard label="Rejected" value={stats.rejected} color="rejected" icon="❌" />
          <StatCard label="Published" value={stats.published} color="published" icon="🌐" />
        </div>

        {/* Filter Tabs + Search */}
        <div className="admin-toolbar">
          <div className="admin-tabs" role="tablist">
            {TABS.map(t => (
              <button
                key={t.key}
                role="tab"
                aria-selected={filter === t.key}
                className={`admin-tab ${filter === t.key ? 'admin-tab-active' : ''}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
                <span className="admin-tab-count">{t.count}</span>
              </button>
            ))}
          </div>
          <div className="admin-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="search"
              className="admin-search"
              placeholder="Search by title, author, category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search articles"
            />
          </div>
        </div>

        {/* Articles Table */}
        <div className="admin-table-wrap">
          {filtered.length === 0 ? (
            <div className="admin-empty">
              <span>📭</span>
              <p>No articles found{filter !== 'all' ? ` with status "${filter}"` : ''}{search ? ` matching "${search}"` : ''}.</p>
            </div>
          ) : (
            <table className="admin-table" role="grid">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(article => {
                  const st = article.status
                  const statusInfo = STATUS_LABELS[st]
                  return (
                    <tr key={article.id} className="admin-table-row">
                      <td className="admin-col-title">
                        <div className="admin-article-thumb-row">
                          {article.image && (
                            <img
                              src={article.image}
                              alt=""
                              className="admin-thumb"
                              onError={e => { e.target.style.display = 'none' }}
                            />
                          )}
                          <button
                            className="admin-title-btn"
                            onClick={() => setSelected(article)}
                          >
                            {article.title}
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="admin-author-cell">
                          <span className="admin-author-name">{article.author}</span>
                          <span className="admin-author-email">{article.email}</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-category-tag">{article.category}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${statusInfo?.color}`}>{statusInfo?.label}</span>
                      </td>
                      <td className="admin-col-date">{formatDate(article.submittedAt)}</td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="btn-table-action"
                            onClick={() => setSelected(article)}
                            title="Review"
                          >
                            Review
                          </button>
                          {st === 'pending' && (
                            <>
                              <button
                                className="btn-table-action btn-table-approve"
                                onClick={() => { articleStore.approve(article.id); refresh() }}
                                title="Quick approve"
                              >
                                ✓
                              </button>
                              <button
                                className="btn-table-action btn-table-reject"
                                onClick={() => { articleStore.reject(article.id, ''); refresh() }}
                                title="Quick reject"
                              >
                                ✗
                              </button>
                            </>
                          )}
                          {st === 'approved' && (
                            <button
                              className="btn-table-action btn-table-publish"
                              onClick={() => { articleStore.publish(article.id); refresh() }}
                              title="Publish"
                            >
                              Publish
                            </button>
                          )}
                          {st === 'published' && (
                            <Link to={`/article/${article.id}`} target="_blank" className="btn-table-action btn-table-view">
                              View
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selected && (
        <ArticleDetailModal
          article={selected}
          onClose={() => setSelected(null)}
          onRefresh={refresh}
        />
      )}
    </div>
  )
}
