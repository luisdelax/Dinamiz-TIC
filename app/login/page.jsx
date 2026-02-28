'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState([])
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorAnimation, setErrorAnimation] = useState(false)

  useEffect(() => {
    setMounted(true)
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
    })))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', { credentials: 'include', 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Credenciales incorrectas')
        setErrorAnimation(true)
        setTimeout(() => setErrorAnimation(false), 500)
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión. Intenta nuevamente.')
      setErrorAnimation(true)
      setTimeout(() => setErrorAnimation(false), 500)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-green-400/40 animate-float"
            style={{
              left: p.x,
              top: p.y,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-2xl glass neon-border shadow-2xl shadow-green-500/20 mx-4 animate-fade-in-up"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <span className="text-3xl font-bold text-green-400">DT</span>
          </div>
        </div>
        <h2 className="mb-2 text-2xl md:text-3xl font-bold text-center text-white">
          Dinamiz TIC
        </h2>
        <p className="mb-6 md:mb-8 text-center text-green-400/70 text-sm md:text-base">
          Sistema de Gestión
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-green-300/90">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-white bg-slate-800/50 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300 placeholder-slate-500"
                placeholder="admin@sistema.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-green-300/90">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 text-white bg-slate-800/50 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300 placeholder-slate-500"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-green-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-4 rounded-lg border animate-fade-in-up ${
              errorAnimation 
                ? 'bg-red-500/20 border-red-500/50 animate-shake' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <div>
                  <p className="text-red-400 font-medium text-sm">Error de autenticación</p>
                  <p className="text-red-300/70 text-xs">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 font-semibold text-slate-900 bg-green-400 rounded-lg hover:bg-green-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            ) : (
              'Ingresar al Dashboard'
            )}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-green-300/50">
          Sistema de Gestión v2.0 | Tecnología de vanguardia
        </p>
      </div>
    </div>
  )
}
