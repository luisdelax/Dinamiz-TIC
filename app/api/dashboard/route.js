import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function verifyAuth(request) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const [
      totalEquipos,
      equiposDisponibles,
      equiposAsignados,
      totalTickets,
      ticketsAbiertos,
      ticketsEnProceso,
      ticketsResueltos,
      ticketsCerrados,
      totalFuncionarios,
      prestamosActivos,
      prestamosTotales,
      totalPerifericos,
      totalAudiovisuales,
      reservasProximas,
      ticketsPorMes,
      equiposPorTipo,
      prestamosPorTipo,
      tareasPorEstado,
      tareasPorPrioridad
    ] = await Promise.all([
      prisma.equipoComputo.count({ where: { activo: true } }),
      prisma.equipoComputo.count({ where: { activo: true, estado: 'Disponible' } }),
      prisma.equipoComputo.count({ where: { activo: true, estado: 'Asignado' } }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { estado: 'Abierto' } }),
      prisma.ticket.count({ where: { estado: 'EnProceso' } }),
      prisma.ticket.count({ where: { estado: 'Resuelto' } }),
      prisma.ticket.count({ where: { estado: 'Cerrado' } }),
      prisma.funcionario.count({ where: { activo: true } }),
      prisma.prestamo.count({ where: { estado: 'Aprobado', fechaDevolucion: null } }),
      prisma.prestamo.count(),
      prisma.periferico.count({ where: { activo: true } }),
      prisma.equipoAudiovisual.count({ where: { activo: true } }),
      prisma.reservaAuditorio.count({ 
        where: { 
          estado: 'Aprobado',
          fechaInicio: { gte: new Date() }
        } 
      }),
      prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") as mes, COUNT(*) as cantidad
        FROM "Ticket"
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY mes
      `,
      prisma.$queryRaw`
        SELECT tipo, COUNT(*) as cantidad
        FROM "EquipoComputo"
        WHERE "activo" = true
        GROUP BY tipo
      `,
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN "equipoComputoId" IS NOT NULL THEN 'Equipo Computo'
            WHEN "perifericoId" IS NOT NULL THEN 'Periferico'
            WHEN "audiovisualId" IS NOT NULL THEN 'Audiovisual'
          END as tipo,
          COUNT(*) as cantidad
        FROM "Prestamo"
        GROUP BY 
          CASE 
            WHEN "equipoComputoId" IS NOT NULL THEN 'Equipo Computo'
            WHEN "perifericoId" IS NOT NULL THEN 'Periferico'
            WHEN "audiovisualId" IS NOT NULL THEN 'Audiovisual'
          END
      `,
      prisma.$queryRaw`
        SELECT estado, COUNT(*) as cantidad
        FROM "Tarea"
        WHERE "activo" = true
        GROUP BY estado
      `,
      prisma.$queryRaw`
        SELECT prioridad, COUNT(*) as cantidad
        FROM "Tarea"
        WHERE "activo" = true
        GROUP BY prioridad
      `
    ])

    const ticketsAbiertosTotal = ticketsAbiertos + ticketsEnProceso

    return NextResponse.json({
      stats: {
        ticketsAbiertos: ticketsAbiertosTotal,
        ticketsResueltos,
        equiposActivos: totalEquipos,
        equiposDisponibles,
        funcionarios: totalFuncionarios,
        prestamos: prestamosActivos,
        perifericos: totalPerifericos,
        audiovisuales: totalAudiovisuales,
        reservasProximas,
      },
      charts: {
        ticketsPorEstado: [
          { name: 'Abiertos', value: ticketsAbiertos, color: '#ef4444' },
          { name: 'En Proceso', value: ticketsEnProceso, color: '#eab308' },
          { name: 'Resueltos', value: ticketsResueltos, color: '#3b82f6' },
          { name: 'Cerrados', value: ticketsCerrados, color: '#22c55e' },
        ],
        ticketsPorMes: ticketsPorMes.map((t) => ({
          mes: new Date(t.mes).toLocaleDateString('es-CO', { month: 'short' }),
          cantidad: Number(t.cantidad)
        })),
        equiposPorTipo: equiposPorTipo.map((e) => ({
          tipo: e.tipo,
          cantidad: Number(e.cantidad)
        })),
        prestamosPorTipo: prestamosPorTipo.map((p) => ({
          tipo: p.tipo || 'Otro',
          cantidad: Number(p.cantidad)
        })),
        estadoEquipos: [
          { name: 'Disponibles', value: equiposDisponibles, color: '#22c55e' },
          { name: 'Asignados', value: equiposAsignados, color: '#3b82f6' },
        ],
        tareasPorEstado: tareasPorEstado.map((t) => ({
          name: t.estado === 'EnProceso' ? 'En Proceso' : t.estado,
          value: Number(t.cantidad),
          color: t.estado === 'Pendiente' ? '#eab308' : t.estado === 'EnProceso' ? '#3b82f6' : t.estado === 'Completada' ? '#22c55e' : '#6b7280'
        })),
        tareasPorPrioridad: tareasPorPrioridad.map((t) => ({
          prioridad: t.prioridad,
          cantidad: Number(t.cantidad)
        }))
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
