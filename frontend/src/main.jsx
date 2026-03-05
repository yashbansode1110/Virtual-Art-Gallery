import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from './config'

// Configure axios to use API base URL
axios.defaults.baseURL = API_BASE_URL

// Add auth token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
) 