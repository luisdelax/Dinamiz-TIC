'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Computer, 
  Wifi, 
  Ticket, 
  Calendar, 
  Warehouse,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Monitor,
  HardDrive,
  UserCog,
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  CheckSquare,
  XCircle,
  RefreshCw,
  MapPin
} from 'lucide-react'
import { useUpperCase } from '@/components/CRUDBase'

export default function Configuracion() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState('/configuracion')
  const [activeTab, setActiveTab] = useState('perfil')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [notificaciones, setNotificaciones] = useState([])
  const [notifSinLeer, setNotifSinLeer] = useState(0)
  const [showNotif, setShowNotif] = useState(false)

  const nombre = useUpperCase('')
  const apellido = useUpperCase('')
  const email = useState('')
  
  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  })

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchNotificaciones()
      const interval = setInterval(fetchNotificaciones, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch('/api/notificaciones', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setNotificaciones(data.notificaciones || [])
        setNotifSinLeer(data.sinLeer || 0)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const marcarLeida = async (id) => {
    try {
      await fetch('/api/notificaciones', { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchNotificaciones()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const marcarTodasLeidas = async () => {
    try {
      await fetch('/api/notificaciones', { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todas: true })
      })
      fetchNotificaciones()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        nombre.setValue(data.user.nombre || '')
        apellido.setValue(data.user.apellido || '')
        email.setValue(data.user.email || '')
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
  }

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Users, label: 'Funcionarios', href: '/funcionarios', roles: ['Administrador', 'Superusuario'] },
    { icon: Computer, label: 'Equipos Computo', href: '/equipos/computo', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Wifi, label: 'Telecomunicaciones', href: '/equipos/telecom', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: HardDrive, label: 'Periféricos', href: '/perifericos', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Monitor, label: 'Audiovisuales', href: '/audiovisuales', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Ticket, label: 'Tickets', href: '/tickets', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: CheckSquare, label: 'Tareas', href: '/tareas', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: MapPin, label: 'Ubicaciones', href: '/ubicaciones', roles: ['Administrador', 'Superusuario'] },
    { icon: Warehouse, label: 'Préstamos', href: '/prestamos', roles: ['Administrador', 'Superusuario'] },
    { icon: Calendar, label: 'Auditorio', href: '/auditorio', roles: ['Administrador', 'Superusuario'] },
    { icon: UserCog, label: 'Usuarios', href: '/usuarios', roles: ['Administrador'] },
    { icon: FileText, label: 'Informes', href: '/informes', roles: ['Administrador', 'Superusuario'] },
    { icon: Settings, label: 'Configuración', href: '/configuracion', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
  ]

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.rol))

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/auth/perfil', { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.value,
          apellido: apellido.value,
          email: email.value
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setUser({ ...user, nombre: nombre.value, apellido: apellido.value, email: email.value })
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al actualizar perfil' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar perfil' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.nueva !== passwordData.confirmar) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }
    
    if (passwordData.nueva.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }
    
    setSaving(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/auth/password', { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordActual: passwordData.actual,
          passwordNueva: passwordData.nueva
        })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
        setPasswordData({ actual: '', nueva: '', confirmar: '' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al cambiar contraseña' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar contraseña' })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'password', label: 'Contraseña', icon: Lock },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-green-500/20 flex items-center justify-between px-4 z-40">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-800 text-green-400"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-green-400 text-lg">Dinamiz TIC</h1>
        <button 
          onClick={() => setShowNotif(!showNotif)}
          className="p-2 rounded-lg hover:bg-slate-800 text-green-400 relative"
        >
          <Bell size={20} />
          {notifSinLeer > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
              {notifSinLeer > 9 ? '9+' : notifSinLeer}
            </span>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-slate-950 border-r border-green-500/20 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-green-500/20 flex items-center justify-between">
                <h1 className="font-bold text-green-400 text-xl">Dinamiz TIC</h1>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      activePath === item.href
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-green-300'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ))}
              </nav>
              <div className="p-3 border-t border-green-500/20">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Notifications */}
      <AnimatePresence>
        {showNotif && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotif(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden fixed top-16 right-2 left-2 bg-slate-900 border border-green-500/30 rounded-xl shadow-xl z-50 overflow-hidden max-h-[60vh]"
            >
              <div className="p-3 border-b border-green-500/20 flex items-center justify-between">
                <h3 className="text-white font-medium">Notificaciones</h3>
                {notifSinLeer > 0 && (
                  <button 
                    onClick={marcarTodasLeidas}
                    className="text-xs text-green-400 hover:text-green-300"
                  >
                    Marcar todo leído
                  </button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {notificaciones.length > 0 ? (
                  notificaciones.slice(0, 10).map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => { if (!notif.leida) marcarLeida(notif.id); setShowNotif(false) }}
                      className={`p-3 border-b border-green-500/10 cursor-pointer hover:bg-slate-800/50 ${
                        !notif.leida ? 'bg-green-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {!notif.leida && (
                          <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                        )}
                        <div className="flex-1">
                          <p className={`text-sm ${notif.leida ? 'text-slate-400' : 'text-white'}`}>
                            {notif.titulo}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.mensaje}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    Sin notificaciones
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden lg:flex bg-slate-950 border-r border-green-500/20 flex-col fixed h-full z-40"
      >
        <div className="p-4 border-b border-green-500/20">
          <h1 className={`font-bold text-green-400 transition-all ${sidebarOpen ? 'text-xl' : 'text-lg text-center'}`}>
            {sidebarOpen ? 'Dinamiz TIC' : 'DT'}
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activePath === item.href
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-green-300'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-3 border-t border-green-500/20">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:pl-[260px] flex-1 flex flex-col pt-14 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-slate-950/50 border-b border-green-500/20 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-800 text-green-400"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-green-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="p-2 rounded-lg hover:bg-slate-800 text-green-400 relative"
              >
                <Bell size={20} />
                {notifSinLeer > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notifSinLeer > 9 ? '9+' : notifSinLeer}
                  </span>
                )}
              </button>
              
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-green-500/30 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-green-500/20 flex items-center justify-between">
                    <h3 className="text-white font-medium">Notificaciones</h3>
                    {notifSinLeer > 0 && (
                      <button 
                        onClick={marcarTodasLeidas}
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        Marcar todo leído
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificaciones.length > 0 ? (
                      notificaciones.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => { if (!notif.leida) marcarLeida(notif.id) }}
                          className={`p-3 border-b border-green-500/10 cursor-pointer hover:bg-slate-800/50 ${
                            !notif.leida ? 'bg-green-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.leida && (
                              <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${notif.leida ? 'text-slate-400' : 'text-white'}`}>
                                {notif.titulo}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">{notif.mensaje}</p>
                              <p className="text-xs text-green-400/50 mt-1">
                                {new Date(notif.createdAt).toLocaleString('es-CO')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        Sin notificaciones
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <a href="/configuracion" className="flex items-center gap-3 hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <span className="text-green-400 font-medium">
                  {user?.nombre?.[0]}{user?.apellido?.[0]}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{user?.nombre} {user?.apellido}</p>
                <p className="text-green-400/70">{user?.rol}</p>
              </div>
            </a>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-4 lg:p-6 pb-20 lg:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 lg:mb-6"
          >
            <h2 className="text-lg lg:text-2xl font-bold text-white">Configuración</h2>
            <p className="text-green-400/70 text-sm">Administra tu perfil y preferencias</p>
          </motion.div>

          <div className="bg-slate-800/50 border border-green-500/20 rounded-xl">
            {/* Tabs - Scrollable on mobile */}
            <div className="border-b border-green-500/20 overflow-x-auto">
              <div className="flex gap-1 lg:gap-2 p-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMessage(null) }}
                    className={`flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-green-300'
                    }`}
                  >
                    <tab.icon size={14} className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 lg:p-6">
              {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {message.text}
                </div>
              )}

              {activeTab === 'perfil' && (
                <form onSubmit={handleProfileUpdate} className="max-w-md space-y-4">
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <span className="text-green-400 text-xl lg:text-2xl font-bold">
                        {user?.nombre?.[0]}{user?.apellido?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm lg:text-base">{user?.nombre} {user?.apellido}</p>
                      <p className="text-green-400/70 text-xs lg:text-sm">{user?.rol}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs lg:text-sm font-medium text-green-300/90">Nombre</label>
                    <input
                      type="text"
                      value={nombre.value}
                      onChange={nombre.onChange}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase text-sm lg:text-base"
                      placeholder="NOMBRE"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs lg:text-sm font-medium text-green-300/90">Apellido</label>
                    <input
                      type="text"
                      value={apellido.value}
                      onChange={apellido.onChange}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase text-sm lg:text-base"
                      placeholder="APELLIDO"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs lg:text-sm font-medium text-green-300/90">Email</label>
                    <input
                      type="email"
                      value={email.value}
                      onChange={(e) => email.setValue(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-sm lg:text-base"
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-400 text-slate-900 font-medium rounded-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="w-4 h-4 lg:w-5 lg:h-5" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                  <div>
                    <label className="block mb-1.5 text-xs lg:text-sm font-medium text-green-300/90">Contraseña Actual</label>
                    <div className="relative">
                      <input
                        type={showPasswords.actual ? 'text' : 'password'}
                        value={passwordData.actual}
                        onChange={(e) => setPasswordData({...passwordData, actual: e.target.value})}
                        className="w-full px-3 py-2.5 pr-10 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-sm lg:text-base"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, actual: !showPasswords.actual})}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-400"
                      >
                        {showPasswords.actual ? <EyeOff size={18} className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye size={18} className="w-4 h-4 lg:w-5 lg:h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs lg:text-sm font-medium text-green-300/90">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPasswords.nueva ? 'text' : 'password'}
                        value={passwordData.nueva}
                        onChange={(e) => setPasswordData({...passwordData, nueva: e.target.value})}
                        className="w-full px-3 py-2.5 pr-10 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-sm lg:text-base"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, nueva: !showPasswords.nueva})}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-400"
                      >
                        {showPasswords.nueva ? <EyeOff size={18} className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye size={18} className="w-4 h-4 lg:w-5 lg:h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs lg:text-sm font-medium text-green-300/90">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirmar ? 'text' : 'password'}
                        value={passwordData.confirmar}
                        onChange={(e) => setPasswordData({...passwordData, confirmar: e.target.value})}
                        className="w-full px-3 py-2.5 pr-10 bg-slate-800/50 border border-green-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-sm lg:text-base"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({...showPasswords, confirmar: !showPasswords.confirmar})}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-400"
                      >
                        {showPasswords.confirmar ? <EyeOff size={18} className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye size={18} className="w-4 h-4 lg:w-5 lg:h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-400 text-slate-900 font-medium rounded-lg transition-all disabled:opacity-50 text-sm lg:text-base"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Cambiando...
                      </>
                    ) : (
                      <>
                        <Lock size={18} className="w-4 h-4 lg:w-5 lg:h-5" />
                        Cambiar Contraseña
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-green-500/20 lg:hidden z-50 safe-area-pb">
          <div className="flex justify-around items-center h-14">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = activePath === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-1 ${
                    isActive ? 'text-green-400' : 'text-slate-400'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[9px] mt-0.5 truncate max-w-[60px]">{item.label}</span>
                </a>
              )
            })}
          </div>
        </nav>

        {/* Desktop Footer */}
        <footer className="hidden lg:block py-3 px-6 border-t border-green-500/20 bg-slate-950/30">
          <p className="text-center text-slate-500 text-xs lg:text-sm">
            © 2026 Dinamiz TIC. Derechos reservados a Luis E. De La Cruz F.
          </p>
        </footer>
      </div>
    </div>
  )
}
