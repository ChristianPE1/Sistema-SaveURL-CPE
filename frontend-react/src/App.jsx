import { Routes, Route } from 'react-router-dom'
import './App.css'
import 'react-toastify/dist/ReactToastify.css'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import PostsPage from './pages/posts/PostsPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import NavBar from './components/NavBar'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <NavBar />

      <main className="flex-1 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
