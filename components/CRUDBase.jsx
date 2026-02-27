'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Computer, 
  Wifi, 
  Settings,
  Speaker,
  Ticket,
  Warehouse,
  Calendar,
  FileText,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Monitor,
  MapPin,
  UserCog,
  CheckSquare
} from 'lucide-react'

export function toUpperCase(value, isEmail = false) {
  if (isEmail) return value
  return value.toUpperCase()
}

export function useUpperCase(initialValue = '', isEmail = false) {
  const [value, setValue] = useState(initialValue)
  
  const handleChange = (e) => {
    const newValue = isEmail ? e.target.value : e.target.value.toUpperCase()
    setValue(newValue)
  }
  
  return { value, onChange: handleChange, setValue }
}

export default function CRUDBase({ children, title, subtitle }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState('/dashboard')

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
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

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
  }

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

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Funcionarios', href: '/funcionarios' },
    { icon: Computer, label: 'Equipos Computo', href: '/equipos/computo' },
    { icon: Wifi, label: 'Telecomunicaciones', href: '/equipos/telecom' },
    { icon: Settings, label: 'Periféricos', href: '/perifericos' },
    { icon: Speaker, label: 'Audiovisuales', href: '/audiovisuales' },
    { icon: Ticket, label: 'Tickets', href: '/tickets' },
    { icon: CheckSquare, label: 'Tareas', href: '/tareas' },
    { icon: MapPin, label: 'Ubicaciones', href: '/ubicaciones' },
    { icon: Warehouse, label: 'Préstamos', href: '/prestamos' },
    { icon: Calendar, label: 'Auditorio', href: '/auditorio' },
    { icon: FileText, label: 'Formatos', href: '/formatos' },
    { icon: FileText, label: 'Informes', href: '/informes' },
    { icon: UserCog, label: 'Usuarios', href: '/usuarios' },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-green-500/20 flex items-center justify-between px-4 z-40">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-800 text-green-400"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-green-400 text-lg">Dinamiz TIC</h1>
        <div className="w-10"></div>
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
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-slate-400 hover:bg-slate-800 hover:text-green-300"
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
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-slate-400 hover:bg-slate-800 hover:text-green-300"
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
      <div className={`lg:pl-[260px] pt-14 lg:pt-0 transition-all duration-300`}>
        <header className="hidden lg:flex h-16 bg-slate-950/50 border-b border-green-500/20 items-center justify-between px-6 sticky top-0 z-30">
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
            <button className="p-2 rounded-lg hover:bg-slate-800 text-green-400 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <span className="text-green-400 font-medium">
                  {user?.nombre?.[0]}{user?.apellido?.[0]}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{user?.nombre} {user?.apellido}</p>
                <p className="text-green-400/70">{user?.rol}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
            <p className="text-green-400/70 text-sm md:text-base">{subtitle}</p>
          </motion.div>

          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-green-500/20 lg:hidden z-50 safe-area-pb">
          <div className="flex justify-around items-center h-16">
            {menuItems.slice(0, 5).map((item) => {
              const isActive = activePath === item.href
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2 ${
                    isActive ? 'text-green-400' : 'text-slate-400'
                  }`}
                >
                  <item.icon size={22} />
                  <span className="text-[10px] mt-1">{item.label}</span>
                </a>
              )
            })}
          </div>
        </nav>

        <footer className="hidden lg:block py-4 px-6 border-t border-green-500/20 bg-slate-900/50">
          <p className="text-center text-slate-500 text-sm">
            © 2026 Dinamiz TIC. Derechos reservados a Luis E. De La Cruz F.
          </p>
        </footer>
      </div>
    </div>
  )
}

export function DataTable({ columns, data, onEdit, onDelete, onView, searchFields = [], searchFn = null }) {
  const [search, setSearch] = useState('')

  const filteredData = searchFields.length > 0 && search
    ? data.filter(row => {
        if (searchFn) {
          return searchFn(row, search)
        }
        return searchFields.some(field => {
          const value = row[field]
          return value && String(value).toLowerCase().includes(search.toLowerCase())
        })
      })
    : data

  return (
    <div className="space-y-4">
      {searchFields.length > 0 && (
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-green-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"
          />
        </div>
      )}

      <div className="bg-slate-800/50 border border-green-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-slate-950/50">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-green-400/70 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
                <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-medium text-green-400/70">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-500/10">
              {filteredData.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  {columns.map((col, j) => (
                    <td key={j} className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-300 whitespace-nowrap">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button onClick={() => onView(row)} className="p-1.5 md:p-2 rounded-lg hover:bg-slate-700 text-green-400">
                          <Eye size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="p-1.5 md:p-2 rounded-lg hover:bg-slate-700 text-blue-400">
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="p-1.5 md:p-2 rounded-lg hover:bg-slate-700 text-red-400">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-6 md:p-8 text-center text-slate-500 text-sm md:text-base">
            {search ? 'No se encontraron resultados' : 'No hay registros'}
          </div>
        )}
      </div>
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeClasses = {
    sm: 'max-w-sm w-[95%] sm:w-[90%]',
    md: 'max-w-lg w-[95%] sm:w-[90%]',
    lg: 'max-w-2xl w-[95%] sm:w-[90%]',
    xl: 'max-w-3xl w-[95%] sm:w-[90%]',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`${sizeClasses[size]} bg-slate-900 border border-green-500/30 rounded-xl p-4 md:p-6 shadow-2xl shadow-green-500/20 overflow-y-auto max-h-[90vh] w-full`}
            >
              <div className="flex items-center justify-between mb-4 md:mb-5 pr-8">
                <h3 className="text-base md:text-lg font-bold text-white">{title}</h3>
                <button 
                  onClick={onClose} 
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Button({ children, onClick, variant = 'primary', type = 'button', disabled, className = '' }) {
  const variants = {
    primary: 'bg-green-500 hover:bg-green-400 text-slate-900',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-red-500 hover:bg-red-400 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} px-3 md:px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base ${className}`}
    >
      {children}
    </button>
  )
}

export function Input({ label, type = 'text', value, onChange, required, placeholder, options, className = '' }) {
  if (type === 'select') {
    return (
      <div className={className}>
        <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">{label}</label>
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-400/50"
        >
          <option value="">Seleccionar...</option>
          {options?.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div className={className}>
        <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">{label}</label>
        <textarea
          value={value}
          onChange={onChange}
          rows={3}
          className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
          placeholder={placeholder}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"
      />
    </div>
  )
}
