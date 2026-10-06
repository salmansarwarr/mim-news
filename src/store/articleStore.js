// =============================================================================
// MIM NEWS — Article Store (localStorage-based persistence)
// Handles the full article lifecycle: Submit → Pending → Approve/Reject → Publish
// =============================================================================

const STORE_KEY = 'mim_news_articles'

// ─── Seed data: pre-existing published articles ───────────────────────────────
const SEED_ARTICLES = [
  {
    id: 'published-1',
    status: 'published',
    title: 'Karachi Port Telemetry Hits Record High in Q3 2026',
    category: 'Business & Trade',
    author: 'Maritime Bureau',
    email: 'maritime@mimnews.pk',
    bio: 'MIM News Maritime Correspondent covering Pakistan\'s coastal and port economy.',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80',
    content: `<p>Karachi Port Trust reported unprecedented cargo throughput during the third quarter of 2026, with automated telemetry systems logging a 23% increase in container volume over the same period last year.</p>
<p>Port officials attributed the surge to the expansion of the automated container terminal and the introduction of AI-assisted vessel scheduling, which reduced average turnaround time from 48 hours to just 31 hours.</p>
<h2>Economic Impact</h2>
<p>The record volume has had cascading benefits for the national economy. Customs revenue from Port Qasim alone exceeded PKR 18 billion for the quarter, with projections suggesting full-year revenue could breach the PKR 70 billion threshold for the first time.</p>
<p>Industry analysts note that the performance improvement comes despite global shipping disruptions that have affected ports across Asia and Europe.</p>`,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'published-2',
    status: 'published',
    title: 'Federal Cabinet Approves National Digital Infrastructure Policy 2026',
    category: 'Politics',
    author: 'Political Bureau',
    email: 'politics@mimnews.pk',
    bio: 'Senior political correspondent covering federal government and national policy.',
    image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    content: `<p>The Federal Cabinet on Tuesday approved the National Digital Infrastructure Policy 2026, a comprehensive roadmap for expanding broadband access, cloud computing capabilities, and digital public services across Pakistan's four provinces.</p>
<p>Prime Minister's Advisor on IT & Telecom called the policy "a foundational document that will define Pakistan's digital trajectory for the next decade." The policy includes commitments to achieve 100% 4G coverage by 2027 and launch a national 5G rollout strategy by 2028.</p>
<h2>Key Provisions</h2>
<p>Among the policy's most notable provisions is a PKR 45 billion Digital Infrastructure Fund to be disbursed over three years, targeted at underserved districts in Balochistan and rural Sindh. The cabinet also approved the establishment of three government-grade cloud data centers in Lahore, Karachi, and Islamabad.</p>`,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'published-3',
    status: 'published',
    title: 'Pakistan Cricket Team Eyes Series Victory Ahead of Asia Cup Final',
    category: 'Sports',
    author: 'Sports Correspondent',
    email: 'sports@mimnews.pk',
    bio: 'Cricket and sports correspondent for MIM News.',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    content: `<p>Pakistan's national cricket squad is riding a wave of momentum as they prepare for the Asia Cup Final scheduled at Lahore's Gaddafi Stadium this weekend. The team secured their spot in the final with a dominant semi-final performance against India, winning by six wickets.</p>
<p>Captain Babar Azam credited the team's success to their collective batting depth and a spinning attack that has proven devastatingly effective on the home surface. "We've worked hard as a unit. Every player knows their role," Azam told reporters at a pre-final press conference.</p>
<h2>Squad Analysis</h2>
<p>The bowling attack, led by Shaheen Afridi's pace and Shadab Khan's wrist spin, has taken 28 wickets across the tournament, the highest of any team. Analysts predict a high-scoring final if conditions remain as expected.</p>`,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'published-4',
    status: 'published',
    title: 'Sindh Urban Authority Launches Smart Traffic Grid for Karachi Arteries',
    category: 'Karachi Metro',
    author: 'Civic Desk',
    email: 'civic@mimnews.pk',
    bio: 'MIM News Civic Affairs Desk covering urban development and municipal governance.',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    content: `<p>The Sindh Urban Development Authority (SUDA) on Monday announced the phased rollout of a smart traffic management grid covering 42 major arteries across Karachi, in partnership with a consortium of local and Chinese technology firms.</p>
<p>The system, branded as Karachi Smart Traffic Grid (KSTG), uses computer-vision cameras, AI-powered signal controllers, and real-time data analytics to optimize vehicle flow and reduce average commute times by an estimated 28% in targeted corridors.</p>
<h2>Implementation Timeline</h2>
<p>Phase one covers the Clifton, Defence, and Gulshan corridors, with installation expected to be complete by January 2027. Phases two and three will extend the grid to Korangi Industrial Zone, Malir, and SITE areas through mid-2027.</p>`,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'published-5',
    status: 'published',
    title: 'Pakistani Fintech Startups Attract $120M in Regional Venture Funding',
    category: 'Technology',
    author: 'Technology Desk',
    email: 'tech@mimnews.pk',
    bio: 'Technology and innovation correspondent for MIM News.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    content: `<p>Pakistani fintech and AI-logistics startups raised a combined $120 million in venture capital during the first three quarters of 2026, signaling renewed investor confidence in Pakistan's technology sector after a cautious 2025.</p>
<p>The largest single deal was a $40 million Series B round closed by NayaPay, Karachi-based digital payment infrastructure company, led by regional VC firm Asia Frontier Capital alongside two Riyadh-based sovereign wealth fund co-investors.</p>
<h2>Sector Trends</h2>
<p>Analysts at McKinsey & Company's Karachi office noted that the recovery reflects both global capital market stabilization and Pakistan's improving macroeconomic indicators. "The fundamentals are stronger than they appear in headline numbers," said one senior partner. Embedded finance and B2B payment rails continue to attract the deepest investor interest.</p>`,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'pending-1',
    status: 'pending',
    title: 'Local Automakers Call for Tariff Reinstatement on Used Car Imports',
    category: 'Business & Trade',
    author: 'Kalbe Ali',
    email: 'kalbe.ali@example.com',
    bio: 'Senior business reporter covering manufacturing, logistics, and trade policy.',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
    content: `<p>Pakistan's local automobile manufacturers have formally appealed to the Ministry of Commerce requesting the reinstatement of tariff protections on imported used vehicles, citing a sharp and sudden spike in used car imports that followed regulatory changes in late 2025.</p>
<p>The Pakistan Automotive Manufacturers Association (PAMA) submitted a 47-page petition arguing that the current import surge threatens an industry employing over 1.8 million workers across the domestic supply chain.</p>
<h2>Industry Concerns</h2>
<p>PAMA's chairman stated that used car imports in September 2026 were 340% higher than the same month in 2025, with the majority of vehicles arriving from Japan and the UAE. "This is not healthy competition — it's an asymmetric shock," he told reporters outside the Ministry of Commerce in Islamabad.</p>`,
    publishedAt: null,
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'pending-2',
    status: 'pending',
    title: 'University of Karachi Team Develops Breakthrough Urdu Natural Language Processing Model',
    category: 'Technology',
    author: 'Dr. Fatima Noor',
    email: 'fatima.noor@uok.edu.pk',
    bio: 'Associate Professor of Computer Science specializing in Computational Linguistics and AI.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    content: `<p>A team of researchers at the University of Karachi's Department of Computer Science has open-sourced <strong>UrduLM-v2</strong>, a 7-billion parameter language model trained exclusively on standardized Urdu literature, legal statutes, and public media corpora.</p>
<p>The model sets new benchmark records for Urdu sentiment analysis, syntactic parsing, and machine translation, outperforming multilingual base models while operating with 60% less compute overhead.</p>
<h2>Practical Applications</h2>
<p>Dr. Noor noted that the model will be freely accessible to developers building automated government citizen portals, judicial transcription software, and educational tools across the country.</p>`,
    publishedAt: null,
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'pending-3',
    status: 'pending',
    title: 'Sindh Healthcare Commission Mandates Digital Health Records for Karachi Hospitals',
    category: 'Health',
    author: 'Dr. Tariq Jameel Siddiqui',
    email: 'tariq.siddiqui@healthjournal.pk',
    bio: 'Public health analyst and medical journalist based in Karachi.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    content: `<p>The Sindh Healthcare Commission (SHCC) has issued an official directive requiring all tertiary care hospitals and diagnostic laboratories in the Karachi division to integrate unified Electronic Health Record (EHR) systems by the second quarter of 2027.</p>
<p>The regulation aims to reduce diagnostic redundancies, eliminate prescription errors, and provide seamless emergency patient history sharing between public civil hospitals and private healthcare networks.</p>`,
    publishedAt: null,
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'approved-1',
    status: 'approved',
    title: 'Balochistan Coastal Highway Modernization Project Commences Next Month',
    category: 'Karachi Metro',
    author: 'Mirza Zafar',
    email: 'm.zafar@infrastructure.pk',
    bio: 'Civil engineering correspondent reporting on federal transport corridors.',
    image: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&q=80',
    content: `<p>The National Highway Authority (NHA) has finalized procurement for the dualization and modernization of the Makran Coastal Highway segment connecting Karachi with Gwadar Port City.</p>
<p>Approved with an allocated expenditure of PKR 62 billion, the multi-year project includes new smart monitoring stations, heavy vehicle bypass loops, and climate-resilient culverts designed to withstand coastal flooding.</p>
<h2>Timeline and Milestones</h2>
<p>Contractors are expected to mobilize ground equipment by early next month, with the initial 80-kilometer bypass corridor slated for completion within 14 calendar months.</p>`,
    publishedAt: null,
    submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'approved-2',
    status: 'approved',
    title: 'State Bank of Pakistan Maintains Benchmark Interest Rate at 11% Amid Disinflation',
    category: 'Business & Trade',
    author: 'Ayesha Raza',
    email: 'ayesha.raza@financetimes.pk',
    bio: 'Central bank and macroeconomic reporter with over a decade of financial journalism experience.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    content: `<p>The Monetary Policy Committee (MPC) of the State Bank of Pakistan decided to maintain the policy rate unchanged at 11 percent, citing continued consolidation in consumer price indices and strengthening foreign exchange reserves.</p>
<p>Governor SBP emphasized that while core inflation has demonstrated steady moderation, external fuel price volatility necessitates a measured, forward-looking stance on monetary easing.</p>`,
    publishedAt: null,
    submittedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    adminNotes: '',
  },
  {
    id: 'rejected-1',
    status: 'rejected',
    title: 'Unverified Rumors Regarding National Currency Revaluation Circulate on Social Media',
    category: 'Business & Trade',
    author: 'Anonymous Contributor',
    email: 'tipster99@fastmail.com',
    bio: 'Independent financial blogger.',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80',
    content: `<p>Unconfirmed claims circulating on messaging platforms suggest the State Bank is planning an overnight re-denomination of the Pakistani Rupee. Sources claim new banknotes are already printed and held in reserve vaults awaiting an imminent decree.</p>`,
    publishedAt: null,
    submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    adminNotes: 'Rejected due to violation of verification standards: The article makes sensational currency claims without official SBP attribution or verified primary documentation. Resubmission requires named institutional sourcing.',
  },
]

// ─── Initialize store ─────────────────────────────────────────────────────────
function initStore() {
  const raw = localStorage.getItem(STORE_KEY)
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_ARTICLES))
    return SEED_ARTICLES
  }
  try {
    return JSON.parse(raw)
  } catch {
    return SEED_ARTICLES
  }
}

function saveStore(articles) {
  localStorage.setItem(STORE_KEY, JSON.stringify(articles))
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const articleStore = {
  /** Get all articles */
  getAll() {
    return initStore()
  },

  /** Get only published articles (for newspaper frontend) */
  getPublished() {
    return initStore().filter(a => a.status === 'published')
  },

  /** Get single article by id */
  getById(id) {
    return initStore().find(a => a.id === id) || null
  },

  /** Submit a new article (public author submission) */
  submit(data) {
    const articles = initStore()
    const newArticle = {
      id: `article-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'pending',
      title: data.title,
      category: data.category,
      author: data.author,
      email: data.email,
      bio: data.bio || '',
      image: data.image || '',
      content: data.content,
      submittedAt: new Date().toISOString(),
      publishedAt: null,
      adminNotes: '',
    }
    articles.unshift(newArticle)
    saveStore(articles)
    return newArticle
  },

  /** Update an article (admin edit) */
  update(id, updates) {
    const articles = initStore()
    const idx = articles.findIndex(a => a.id === id)
    if (idx === -1) return null
    articles[idx] = { ...articles[idx], ...updates }
    saveStore(articles)
    return articles[idx]
  },

  /** Approve an article */
  approve(id) {
    return articleStore.update(id, { status: 'approved', adminNotes: '' })
  },

  /** Reject an article with optional notes */
  reject(id, notes = '') {
    return articleStore.update(id, { status: 'rejected', adminNotes: notes })
  },

  /** Publish an approved article */
  publish(id) {
    return articleStore.update(id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    })
  },

  /** Unpublish a published article (back to approved) */
  unpublish(id) {
    return articleStore.update(id, { status: 'approved', publishedAt: null })
  },

  /** Delete an article permanently */
  delete(id) {
    const articles = initStore().filter(a => a.id !== id)
    saveStore(articles)
  },

  /** Reset store to default seed sample data */
  resetStore() {
    saveStore(SEED_ARTICLES)
    return SEED_ARTICLES
  },

  /** Get raw seed articles list */
  getSeedData() {
    return SEED_ARTICLES
  },
}

export default articleStore
