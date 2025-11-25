import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/home/Dashboard'
import HomePage from './pages/onBoard/HomePage'

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
        <Route path="/documents" element={<Layout><div>Documents Page Coming Soon...</div></Layout>} />
        <Route path="/projects" element={<Layout><div>Projects Page Coming Soon...</div></Layout>} />
        <Route path="/notifications" element={<Layout><div>Notifications Page Coming Soon...</div></Layout>} />
        <Route path="/settings" element={<Layout><div>Settings Page Coming Soon...</div></Layout>} />
      </Routes>
    </Router>
  )
}

export default App