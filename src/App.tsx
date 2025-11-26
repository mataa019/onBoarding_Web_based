import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/home/Dashboard'
import HomePage from './pages/onBoard/HomePage'
import { Project } from './pages/home/Projects'
import { Document } from './pages/home/Documents'
import { Settings } from './pages/home/settings'
import { Portfolio } from './pages/home/Portfolio'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - No Layout */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - With Layout (Sidebar + Header) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
        <Route path="/projects" element={<Layout><Project /></Layout>} />
        <Route path="/documents" element={<Layout><Document /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App