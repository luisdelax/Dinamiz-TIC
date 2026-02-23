import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './auth/AuthContext.jsx'
import { NotificationsProvider } from './context/NotificationsContext.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
)
