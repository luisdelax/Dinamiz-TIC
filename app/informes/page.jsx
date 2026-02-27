'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Monitor,
  HardDrive,
  UserCog,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  ExternalLink,
  Copy,
  CheckCircle,
  CheckSquare,
  RefreshCw
} from 'lucide-react'

export default function Informes() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/informes')
  const [notificaciones, setNotificaciones] = useState([])
  const [notifSinLeer, setNotifSinLeer] = useState(0)
  const [showNotif, setShowNotif] = useState(false)

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
    { icon: Warehouse, label: 'Préstamos', href: '/prestamos', roles: ['Administrador', 'Superusuario'] },
    { icon: Calendar, label: 'Auditorio', href: '/auditorio', roles: ['Administrador', 'Superusuario'] },
    { icon: UserCog, label: 'Usuarios', href: '/usuarios', roles: ['Administrador'] },
    { icon: FileText, label: 'Informes', href: '/informes', roles: ['Administrador', 'Superusuario'] },
    { icon: Settings, label: 'Configuración', href: '/configuracion', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
  ]

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.rol))

  const [downloading, setDownloading] = useState(null)
  const [copiedUrl, setCopiedUrl] = useState(null)

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopiedUrl(key)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const powerBiEndpoints = [
    { key: 'equipos', name: 'Equipos', url: '/api/informes/public?tipo=equipos' },
    { key: 'perifericos', name: 'Periféricos', url: '/api/informes/public?tipo=perifericos' },
    { key: 'audiovisuales', name: 'Audiovisuales', url: '/api/informes/public?tipo=audiovisuales' },
    { key: 'tickets', name: 'Tickets', url: '/api/informes/public?tipo=tickets' },
    { key: 'tickets-tecnico', name: 'Tickets por Técnico', url: '/api/informes/public?tipo=tickets-tecnico' },
    { key: 'prestamos', name: 'Préstamos', url: '/api/informes/public?tipo=prestamos' },
    { key: 'auditorio', name: 'Auditorio', url: '/api/informes/public?tipo=auditorio' },
    { key: 'estadisticas', name: 'Estadísticas', url: '/api/informes/public?tipo=estadisticas' },
  ]

  const powerBiApiKey = 'dinamiz-tic-reports-2024-secure'

  const downloadInforme = async (tipo, title) => {
    setDownloading(tipo)
    try {
      const res = await fetch(`/api/informes?tipo=${tipo}`)
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al descargar el informe')
    } finally {
      setDownloading(null)
    }
  }

  const informes = [
    { title: 'Inventario de Equipos', description: 'Reporte completo de equipos de cómputo', icon: Computer, tipo: 'equipos' },
    { title: 'Inventario de Periféricos', description: 'Reporte de periféricos registrados', icon: HardDrive, tipo: 'perifericos' },
    { title: 'Inventario de Audiovisuales', description: 'Reporte de equipos audiovisuales', icon: Monitor, tipo: 'audiovisuales' },
    { title: 'Tickets por Estado', description: 'Resumen de tickets abiertos, en proceso, resueltos y cerrados', icon: Ticket, tipo: 'tickets' },
    { title: 'Tickets por Técnico', description: 'Desempeño de técnicos por cantidad de tickets atendidos', icon: Users, tipo: 'tickets-tecnico' },
    { title: 'Préstamos Activos', description: 'Listado de préstamos vigentes y próximos a vencer', icon: Warehouse, tipo: 'prestamos' },
    { title: 'Uso del Auditorium', description: 'Reservas y uso del auditorium por dependencia', icon: Calendar, tipo: 'auditorio' },
    { title: 'Estadísticas Generales', description: 'Métricas y estadísticas del sistema', icon: BarChart3, tipo: 'estadisticas' },
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
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -260 }}
        className="bg-slate-950 border-r border-green-500/20 flex flex-col fixed left-0 top-0 h-screen z-50 w-[260px]"
      >
        <div className="p-4 border-b border-green-500/20 flex-shrink-0">
          <h1 className="font-bold text-green-400 text-xl">
            Dinamiz TIC
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
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
      </motion.aside>

      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      <div className="flex-1 flex flex-col lg:ml-[260px]">
        <header className="h-16 bg-slate-950/50 border-b border-green-500/20 flex items-center justify-between px-4 lg:px-6">
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
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-green-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"
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
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={fetchNotificaciones}
                        className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Actualizar"
                      >
                        <RefreshCw size={14} className="text-green-400" />
                      </button>
                      {notifSinLeer > 0 && (
                        <button 
                          onClick={marcarTodasLeidas}
                          className="text-xs text-green-400 hover:text-green-300"
                        >
                          Marcar todo leído
                        </button>
                      )}
                    </div>
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

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white">Informes</h2>
            <p className="text-green-400/70">Genera reportes y estadísticas del sistema</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {informes.map((informe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => downloadInforme(informe.tipo, informe.title)}
                className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    {downloading === informe.tipo ? (
                      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <informe.icon size={24} className="text-green-400" />
                    )}
                  </div>
                  <Download size={20} className="text-slate-500 group-hover:text-green-400 transition-colors" />
                </div>
                <h3 className="text-white font-medium mb-2">{informe.title}</h3>
                <p className="text-slate-400 text-sm">{informe.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-yellow-500/20">
                  <BarChart3 size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Power BI</h3>
                  <p className="text-slate-400 text-sm">Conecta los datos a Power BI para reportes avanzados</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm mb-4">
                Usa los siguientes endpoints API para conectar los datos a Power BI:
              </p>

              <div className="space-y-2">
                {powerBiEndpoints.map((ep) => (
                  <div key={ep.key} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/50 rounded-lg p-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{ep.name}</p>
                      <p className="text-slate-500 text-xs truncate">{typeof window !== 'undefined' ? window.location.origin : ''}{ep.url}</p>
                      <p className="text-yellow-400/70 text-xs font-mono mt-1">x-api-key: {powerBiApiKey}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}${ep.url}\n\nHeaders:\nx-api-key: ${powerBiApiKey}`, ep.key)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors self-end sm:self-center"
                    >
                      {copiedUrl === ep.key ? (
                        <CheckCircle size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} className="text-slate-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Cómo conectar en Power BI:</strong>
                </p>
                <ol className="text-slate-400 text-sm mt-2 list-decimal list-inside space-y-1">
                  <li>Abre Power BI Desktop</li>
                  <li>Selecciona "Obtener datos" → "Web" → "Opciones avanzadas"</li>
                  <li>Copia y pega la URL del endpoint</li>
                  <li>En "Encabezados HTTP", agrega:</li>
                  <ul className="ml-6 list-disc">
                    <li>Nombre: <code className="bg-slate-800 px-1 rounded">x-api-key</code></li>
                    <li>Valor: <code className="bg-slate-800 px-1 rounded">{powerBiApiKey}</code></li>
                  </ul>
                  <li>Configura la autenticación como "Anónimo"</li>
                  <li>Transforma los datos según sea necesario</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </main>

        <footer className="py-4 px-6 border-t border-green-500/20 bg-slate-950/30">
          <p className="text-center text-slate-500 text-sm">
            © 2024 Dinamiz TIC. Todos los derechos reservados a Luis E De La Cruz Fajardo
          </p>
        </footer>
      </div>
    </div>
  )
}
