'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316',
  cyan: '#06b6d4',
  pink: '#ec4899',
  yellow: '#eab308'
}

export default function AdditionalCharts({ data }) {
  const charts = data?.charts || {}
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mt-4">
      <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-3 lg:p-4">
        <h3 className="text-white font-medium text-sm lg:text-base mb-3">Equipos por Marca</h3>
        <div className="h-40 lg:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.equiposPorMarca || []}>
              <XAxis dataKey="marca" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={60}/>
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
              <Bar dataKey="cantidad" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-3 lg:p-4">
        <h3 className="text-white font-medium text-sm lg:text-base mb-3">Equipos por Estado</h3>
        <div className="h-40 lg:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={charts.equiposPorEstado || []} dataKey="cantidad" nameKey="estado" cx="50%" cy="50%" outerRadius={60} label>
                {(charts.equiposPorEstado || []).map((entry) => (
                  <Cell key={entry.estado} fill={entry.color || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-3 lg:p-4">
        <h3 className="text-white font-medium text-sm lg:text-base mb-3">Tickets por Prioridad</h3>
        <div className="h-40 lg:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.ticketsPorPrioridad || []}>
              <XAxis dataKey="prioridad" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #f97316', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
              <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                {(charts.ticketsPorPrioridad || []).map((entry) => (
                  <Cell key={entry.prioridad} fill={entry.color || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-xl p-3 lg:p-4">
        <h3 className="text-white font-medium text-sm lg:text-base mb-3">Tickets por Técnico</h3>
        <div className="h-40 lg:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.ticketsPorTecnico || []}>
              <XAxis dataKey="nombre" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={60}/>
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #06b6d4', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
              <Bar dataKey="cantidad" fill={COLORS.cyan} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-pink-500/20 rounded-xl p-3 lg:p-4">
        <h3 className="text-white font-medium text-sm lg:text-base mb-3">Préstamos por Mes</h3>
        <div className="h-40 lg:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.prestamosPorMes || []}>
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ec4899', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
              <Bar dataKey="cantidad" fill={COLORS.pink} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-yellow-500/20 rounded-xl p-3 lg:p-4">
        <h3 className="text-white font-medium text-sm lg:text-base mb-3">Equipos por Ubicación</h3>
        <div className="h-40 lg:h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.equiposPorUbicacion || []}>
              <XAxis dataKey="ubicacion" stroke="#94a3b8" fontSize={10} angle={-45} textAnchor="end" height={60}/>
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #eab308', borderRadius: '8px' }} itemStyle={{ color: '#fff' }}/>
              <Bar dataKey="cantidad" fill={COLORS.yellow} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
