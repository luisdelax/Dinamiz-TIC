'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  MapPin,
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
  CheckCircle,
  CheckSquare,
  AlertCircle,
  AlertOctagon,
  FilePlus
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import OpenCodeChat from '@/components/OpenCodeChat'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState('/dashboard')
  const [notificaciones, setNotificaciones] = useState([])
  const [notifSinLeer, setNotifSinLeer] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [tareasRecientes, setTareasRecientes] = useState([])
  const [tareasOverdue, setTareasOverdue] = useState(0)

  useEffect(() => {
    fetchUser()
    fetchNotificaciones()
    fetchDashboardData()
    fetchTareas()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname)
    }
  }, [])

  const fetchTareas = async () => {
    try {
      const res = await fetch('/api/tareas', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        const ordenPrioridad = { Urgente: 0, Alta: 1, Media: 2, Baja: 3 }
        const estadosActivos = ['Pendiente', 'EnProceso']
        const activas = data.tareas
          .filter(t => estadosActivos.includes(t.estado))
          .sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad])
          .slice(0, 5)
        setTareasRecientes(activas)
        setTareasOverdue(data.overdueCount || 0)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch('/api/notificaciones', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setNotificaciones(data.notificaciones)
        setNotifSinLeer(data.sinLeer)
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

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
  }

  const handleTareaEstadoChange = async (tareaId, nuevoEstado) => {
    try {
      await fetch(`/api/tareas/${tareaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      fetchTareas()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getPrioridadColor = (prioridad) => {
    const colors = {
      Urgente: 'text-red-400 bg-red-500/20',
      Alta: 'text-orange-400 bg-orange-500/20',
      Media: 'text-yellow-400 bg-yellow-500/20',
      Baja: 'text-green-400 bg-green-500/20',
    }
    return colors[prioridad] || colors.Media
  }

  const getEstadoColor = (estado) => {
    const colors = {
      Pendiente: 'text-slate-400 bg-slate-500/20',
      EnProceso: 'text-blue-400 bg-blue-500/20',
      Completada: 'text-green-400 bg-green-500/20',
      Cancelada: 'text-red-400 bg-red-500/20',
    }
    return colors[estado] || colors.Pendiente
  }

  const isOverdue = (tarea) => {
    if (tarea.fechaLimite && tarea.estado !== 'Completada' && tarea.estado !== 'Cancelada') {
      return new Date(tarea.fechaLimite) < new Date()
    }
    return false
  }

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: FilePlus, label: 'Formatos', href: '/formatos', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
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

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.rol))

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

      {/* Mobile Notifications Dropdown */}
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
                          className={`p-3 border-b border-green-500/10 cursor-pointer hover:bg-slate-800/50 transition-colors ${
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
            <h2 className="text-lg lg:text-2xl font-bold text-white">Bienvenido, {user?.nombre}</h2>
            <p className="text-green-400/70 text-sm">{user?.rol}</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 mb-4 lg:mb-6">
            {[
              { label: 'Tickets', value: dashboardData?.stats?.ticketsAbiertos || 0, icon: AlertCircle, color: 'bg-red-500', href: '/tickets' },
              { label: 'Equipos', value: dashboardData?.stats?.equiposActivos || 0, icon: Computer, color: 'bg-green-500', href: '/equipos/computo' },
              { label: 'Funcionarios', value: dashboardData?.stats?.funcionarios || 0, icon: Users, color: 'bg-blue-500', href: '/funcionarios' },
              { label: 'Préstamos', value: dashboardData?.stats?.prestamos || 0, icon: Warehouse, color: 'bg-purple-500', href: '/prestamos' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 lg:p-4 hover:border-green-500/40 transition-all cursor-pointer"
                onClick={() => window.location.href = stat.href}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs lg:text-sm truncate">{stat.label}</span>
                  <div className={`p-1.5 lg:p-2 rounded-lg ${stat.color}/20`}>
                    <stat.icon size={18} className={`${stat.color.replace('bg-', 'text-')} w-4 h-4 lg:w-5 lg:h-5`} />
                  </div>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tareas Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 lg:p-4 mb-4 lg:mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <CheckSquare size={16} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm lg:text-base">Tareas Recientes</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tareasOverdue > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1">
                    <AlertOctagon size={12} />
                    {tareasOverdue}
                  </span>
                )}
                <button 
                  onClick={() => window.location.href = '/tareas'}
                  className="text-green-400 hover:text-green-300 text-xs"
                >
                  Ver →
                </button>
              </div>
            </div>

            {tareasRecientes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {tareasRecientes.map((tarea) => (
                  <div 
                    key={tarea.id}
                    className={`p-2 lg:p-3 rounded-lg border ${isOverdue(tarea) ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/20 bg-slate-700/30'}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${getPrioridadColor(tarea.prioridad)}`}>
                        {tarea.prioridad}
                      </span>
                      {isOverdue(tarea) && <AlertOctagon size={12} className="text-red-400" />}
                    </div>
                    <h4 className="text-white text-xs lg:text-sm font-medium mb-1 line-clamp-1">{tarea.titulo}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${getEstadoColor(tarea.estado)}`}>
                        {tarea.estado === 'EnProceso' ? 'En Proceso' : tarea.estado}
                      </span>
                      {tarea.estado !== 'Completada' && tarea.estado !== 'Cancelada' && (
                        <select
                          value={tarea.estado}
                          onChange={(e) => handleTareaEstadoChange(tarea.id, e.target.value)}
                          className="text-[10px] bg-slate-600 text-white rounded px-1 py-0.5"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="EnProceso">En Proceso</option>
                          <option value="Completada">Completada</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-sm">
                <CheckCircle size={24} className="mx-auto mb-1 opacity-50" />
                <p>Sin tareas pendientes</p>
              </div>
            )}
          </motion.div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 mb-4 lg:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 lg:p-4"
            >
              <h3 className="text-white font-medium text-sm lg:text-base mb-3">Tickets por Estado</h3>
              <div className="h-40 lg:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.charts?.ticketsPorEstado || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData?.charts?.ticketsPorEstado?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 lg:p-4"
            >
              <h3 className="text-white font-medium text-sm lg:text-base mb-3">Equipos por Tipo</h3>
              <div className="h-40 lg:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData?.charts?.equiposPorTipo || []}>
                    <XAxis dataKey="tipo" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="cantidad" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 lg:p-4"
            >
              <h3 className="text-white font-medium text-sm lg:text-base mb-3">Tickets por Mes</h3>
              <div className="h-40 lg:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData?.charts?.ticketsPorMes || []}>
                    <XAxis dataKey="mes" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-3 lg:p-4"
            >
              <h3 className="text-white font-medium text-sm lg:text-base mb-3">Estado de Equipos</h3>
              <div className="h-40 lg:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.charts?.estadoEquipos || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData?.charts?.estadoEquipos?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-3 text-center">
              <Monitor size={20} className="text-green-400 mx-auto mb-1" />
              <p className="text-slate-400 text-xs">Audiovisuales</p>
              <p className="text-white text-lg font-bold">{dashboardData?.stats?.audiovisuales || 0}</p>
            </div>
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-3 text-center">
              <HardDrive size={20} className="text-green-400 mx-auto mb-1" />
              <p className="text-slate-400 text-xs">Periféricos</p>
              <p className="text-white text-lg font-bold">{dashboardData?.stats?.perifericos || 0}</p>
            </div>
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-3 text-center">
              <CheckCircle size={20} className="text-green-400 mx-auto mb-1" />
              <p className="text-slate-400 text-xs">Resueltos</p>
              <p className="text-white text-lg font-bold">{dashboardData?.stats?.ticketsResueltos || 0}</p>
            </div>
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-3 text-center">
              <Calendar size={20} className="text-green-400 mx-auto mb-1" />
              <p className="text-slate-400 text-xs">Reservas</p>
              <p className="text-white text-lg font-bold">{dashboardData?.stats?.reservasProximas || 0}</p>
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
            © 2024 Dinamiz TIC
          </p>
        </footer>
      </div>
      <OpenCodeChat />
    </div>
  )
}
