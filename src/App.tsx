import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Auth/Login'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Dashboard " element={<div>Analytics Page Coming Soon...</div>} />
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