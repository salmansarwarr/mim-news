import { useState, useRef } from 'react'
import usePageMeta from '../components/usePageMeta'
import articleStore from '../store/articleStore'

const CATEGORIES = [
  'Politics',
  'Business & Trade',
  'Technology',
  'Sports',
  'Karachi Metro',
  'Health',
  'Education',
  'Arts & Culture',
  'Environment',
  'International',
]

// ─── Simple Rich Text Editor Toolbar ─────────────────────────────────────────
function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null)

  function execCmd(cmd, val = null) {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
    onChange(editorRef.current?.innerHTML || '')
  }

  function handleInput() {
    onChange(editorRef.current?.innerHTML || '')
  }

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar" role="toolbar" aria-label="Text formatting">
        <button type="button" className="rte-btn" onClick={() => execCmd('bold')} title="Bold"><b>B</b></button>
        <button type="button" className="rte-btn" onClick={() => execCmd('italic')} title="Italic"><i>I</i></button>
        <button type="button" className="rte-btn" onClick={() => execCmd('underline')} title="Underline"><u>U</u></button>
        <div className="rte-divider" />
        <button type="button" className="rte-btn" onClick={() => execCmd('formatBlock', 'h2')} title="Heading 2">H2</button>
        <button type="button" className="rte-btn" onClick={() => execCmd('formatBlock', 'h3')} title="Heading 3">H3</button>
        <button type="button" className="rte-btn" onClick={() => execCmd('formatBlock', 'p')} title="Paragraph">P</button>
        <div className="rte-divider" />
        <button type="button" className="rte-btn" onClick={() => execCmd('insertUnorderedList')} title="Bullet List">• List</button>
        <button type="button" className="rte-btn" onClick={() => execCmd('insertOrderedList')} title="Numbered List">1. List</button>
        <div className="rte-divider" />
        <button type="button" className="rte-btn" onClick={() => execCmd('removeFormat')} title="Clear formatting">Clear</button>
      </div>
      <div
        id="article-content-editor"
        ref={editorRef}
        className="rte-body"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        aria-label="Article content editor"
        aria-multiline="true"
        role="textbox"
        data-placeholder="Write your article here... Use the toolbar above to format headings, bold text, and lists."
        dangerouslySetInnerHTML={value ? undefined : undefined}
      />
    </div>
  )
}

// ─── Main Submission Page ─────────────────────────────────────────────────────
export default function Submit() {
  usePageMeta(
    'Submit an Article — MIM News',
    'Share your story with MIM News. Submit articles for editorial review and potential publication on our platform.'
  )

  const [form, setForm] = useState({
    author: '',
    email: '',
    title: '',
    category: '',
    bio: '',
    image: '',
    content: '',
  })
  const [imagePreview, setImagePreview] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef(null)

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function handleImageFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors(e => ({ ...e, image: 'Please upload a valid image file.' }))
      return
    }
    const reader = new FileReader()
    reader.onload = ev => {
      setImagePreview(ev.target.result)
      set('image', ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function validate() {
    const e = {}
    if (!form.author.trim()) e.author = 'Author name is required.'
    if (!form.email.trim()) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.title.trim()) e.title = 'Article title is required.'
    if (!form.category) e.category = 'Please select a category.'
    if (!form.content || form.content.replace(/<[^>]*>/g, '').trim().length < 100)
      e.content = 'Article content must be at least 100 characters.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstErrorEl = document.querySelector('.field-error')
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSubmitting(true)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))
    articleStore.submit(form)
    setSubmitting(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="w submit-success-wrap">
        <div className="submit-success-card">
          <div className="submit-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <span className="submit-success-tag">SUBMISSION RECEIVED</span>
          <h1>Article Submitted Successfully</h1>
          <p>
            Thank you, <strong>{form.author}</strong>! Your article <em>"{form.title}"</em> has been received and
            assigned a <span className="status-badge status-pending">Pending Review</span> status.
          </p>
          <p>
            Our editorial team will review your submission and notify you at <strong>{form.email}</strong> once a
            decision has been made. This typically takes 1–3 business days.
          </p>
          <div className="submit-success-steps">
            <div className="success-step success-step-done">
              <span className="success-step-dot" />
              <div>
                <strong>Submitted</strong>
                <span>Article received by MIM News editorial system</span>
              </div>
            </div>
            <div className="success-step">
              <span className="success-step-dot pending" />
              <div>
                <strong>Pending Review</strong>
                <span>Editorial team will assess your article</span>
              </div>
            </div>
            <div className="success-step">
              <span className="success-step-dot inactive" />
              <div>
                <strong>Decision</strong>
                <span>Approved or rejected with feedback</span>
              </div>
            </div>
            <div className="success-step">
              <span className="success-step-dot inactive" />
              <div>
                <strong>Published</strong>
                <span>Article appears on MIM News</span>
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setSubmitted(false)
              setForm({ author: '', email: '', title: '', category: '', bio: '', image: '', content: '' })
              setImagePreview('')
              setErrors({})
            }}
          >
            Submit Another Article
          </button>
        </div>
      </div>
    )
  }

  // ─── Submission Form ────────────────────────────────────────────────────────
  return (
    <div className="w submit-page">
      {/* Page Header */}
      <div className="submit-header">
        <span className="submit-header-tag">
          <span className="live-beacon-dot" style={{ background: 'var(--red)', boxShadow: '0 0 6px var(--red)' }} />
          AUTHOR PORTAL
        </span>
        <h1>Submit an Article</h1>
        <p>
          Share your reporting, analysis, or opinion with MIM News readers. All submissions go through
          our editorial review process before publication.
        </p>
      </div>

      <div className="submit-layout">
        {/* Form */}
        <form className="submit-form" onSubmit={handleSubmit} noValidate>
          {/* Author Information */}
          <div className="form-section">
            <h2 className="form-section-title">Author Information</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="submit-author">Author Name <span className="required">*</span></label>
                <input
                  id="submit-author"
                  type="text"
                  className={`form-input ${errors.author ? 'input-error' : ''}`}
                  placeholder="Your full name"
                  value={form.author}
                  onChange={e => set('author', e.target.value)}
                  autoComplete="name"
                />
                {errors.author && <span className="field-error">{errors.author}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="submit-email">Email Address <span className="required">*</span></label>
                <input
                  id="submit-email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  autoComplete="email"
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="submit-bio">Author Bio <span className="optional">(Optional)</span></label>
              <textarea
                id="submit-bio"
                className="form-input form-textarea"
                placeholder="Brief biography or credentials (displayed below published articles)"
                value={form.bio}
                onChange={e => set('bio', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Article Details */}
          <div className="form-section">
            <h2 className="form-section-title">Article Details</h2>

            <div className="form-group">
              <label htmlFor="submit-title">Article Title <span className="required">*</span></label>
              <input
                id="submit-title"
                type="text"
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                placeholder="Enter a clear, descriptive headline"
                value={form.title}
                onChange={e => set('title', e.target.value)}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="submit-category">Category <span className="required">*</span></label>
              <select
                id="submit-category"
                className={`form-input form-select ${errors.category ? 'input-error' : ''}`}
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            {/* Featured Image */}
            <div className="form-group">
              <label>Featured Image <span className="optional">(Optional)</span></label>
              <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Featured preview" />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={e => { e.stopPropagation(); setImagePreview(''); set('image', '') }}
                      aria-label="Remove image"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Click to upload featured image</span>
                    <span className="image-upload-sub">PNG, JPG, WEBP — max 5MB</span>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageFile}
                id="submit-image-file"
              />
              {errors.image && <span className="field-error">{errors.image}</span>}
              <div className="or-divider"><span>or paste an image URL</span></div>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={imagePreview ? '' : form.image}
                onChange={e => {
                  set('image', e.target.value)
                  setImagePreview('')
                }}
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="form-section">
            <h2 className="form-section-title">Article Content</h2>
            <div className={`form-group ${errors.content ? 'has-error' : ''}`}>
              <label>Article Body <span className="required">*</span></label>
              <RichTextEditor
                value={form.content}
                onChange={val => set('content', val)}
              />
              {errors.content && <span className="field-error">{errors.content}</span>}
              <span className="form-hint">Minimum 100 characters. Use the toolbar to format your content.</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="submit-disclaimer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              By submitting, you confirm this is original work and grant MIM News the right to edit and publish it.
              All submissions are reviewed by our editorial team before publication. You will not be able to publish directly.
            </span>
          </div>

          <button
            type="submit"
            id="submit-article-btn"
            className="btn-primary btn-submit"
            disabled={submitting}
          >
            {submitting ? (
              <><span className="btn-spinner" />Submitting…</>
            ) : (
              <>Submit Article for Review →</>
            )}
          </button>
        </form>

        {/* Sidebar */}
        <aside className="submit-sidebar">
          <div className="submit-info-card">
            <h3>Submission Guidelines</h3>
            <ul className="guidelines-list">
              <li><span>📝</span> Articles must be original, unpublished work</li>
              <li><span>📏</span> Minimum 400 words recommended</li>
              <li><span>✅</span> All facts must be verifiable and sourced</li>
              <li><span>📷</span> Include a high-quality featured image if possible</li>
              <li><span>🔍</span> Our editors may request revisions</li>
              <li><span>⏱️</span> Review typically takes 1–3 business days</li>
            </ul>
          </div>

          <div className="submit-info-card">
            <h3>Review Process</h3>
            <div className="review-steps">
              <div className="review-step">
                <span className="review-step-num">1</span>
                <div>
                  <strong>Submit</strong>
                  <p>Article enters Pending Review queue</p>
                </div>
              </div>
              <div className="review-step">
                <span className="review-step-num">2</span>
                <div>
                  <strong>Editorial Review</strong>
                  <p>Editors assess accuracy, quality, and fit</p>
                </div>
              </div>
              <div className="review-step">
                <span className="review-step-num">3</span>
                <div>
                  <strong>Approve / Reject</strong>
                  <p>You'll be notified by email</p>
                </div>
              </div>
              <div className="review-step">
                <span className="review-step-num">4</span>
                <div>
                  <strong>Publish</strong>
                  <p>Article appears on MIM News</p>
                </div>
              </div>
            </div>
          </div>

          <div className="submit-info-card submit-contact-card">
            <h3>Questions?</h3>
            <p>Contact our editorial team:</p>
            <a href="mailto:editorial@mimnews.pk" className="editorial-email">editorial@mimnews.pk</a>
          </div>
        </aside>
      </div>
    </div>
  )
}
