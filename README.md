# MIM News website (Vite + React)

    npm install
    npm run dev       # local dev server
    npm run build     # output in dist/

Deploy `dist/` to any static host. Configure an SPA fallback (all routes -> index.html).

Before going live:
1. `src/pages/Contact.jsx`: set `MIM_EMAIL`.
2. Replace `https://www.mimnews.example` in `public/sitemap.xml`, `public/robots.txt` and the og:image tag in `index.html`.
3. `src/data.js`: replace placeholder stories/videos.
