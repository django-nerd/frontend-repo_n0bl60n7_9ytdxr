import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'
import { PricingPage, HowItWorksPage, SamplesPage, ContactPage, DemoPage, CreatePage } from './components/RouterPages'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/samples" element={<SamplesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/create" element={<CreatePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
