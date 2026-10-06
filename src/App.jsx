import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import News from './pages/News'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Submit from './pages/Submit'
import ArticlePage from './pages/ArticlePage'
import CategoryPage from './pages/CategoryPage'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Admin routes — standalone, no public layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />

        {/* Public newspaper layout */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="news" element={<News />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="submit" element={<Submit />} />
          <Route path="article/:id" element={<ArticlePage />} />
          <Route path="category/:category" element={<CategoryPage />} />
          {/* Redirect legacy video path */}
          <Route path="videos" element={<Navigate to="/news" replace />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
