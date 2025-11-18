import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<div>Documents Page Coming Soon...</div>} />
          <Route path="/projects" element={<div>Projects Page Coming Soon...</div>} />
          <Route path="/notifications" element={<div>Notifications Page Coming Soon...</div>} />
          <Route path="/settings" element={<div>Settings Page Coming Soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App