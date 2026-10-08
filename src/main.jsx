import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, Blog, BlogPost, Team, CustomPage, Events, EventDetail, Sponsors, Donate, About, PrivacyPolicy, TermsAndConditions, Resources, ResourceDetail } from './pages'
import { initScrollReveal } from './lib/scrollReveal'
import ScrollToTop from './components/ScrollToTop'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/team" element={<Team />} />
      <Route path="/page/:slug" element={<CustomPage />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<EventDetail />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:slug" element={<ResourceDetail />} />
      <Route path="/sponsors" element={<Sponsors />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
    </Routes>
  </BrowserRouter>
)

initScrollReveal()
