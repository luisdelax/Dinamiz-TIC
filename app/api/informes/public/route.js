import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const reportApiKey = process.env.REPORTS_API_KEY || 'dinamiz-tic-reports-2024-secure'
    
    if (!apiKey || apiKey !== reportApiKey) {
      return NextResponse.json({ error: 'API key inválida o no proporcionada' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    let data = []
    let filename = 'informe'
    let headers = []

    switch (tipo) {
      case 'equipos':
        const equipos = await prisma.equipoComputo.findMany({
          include: { responsable: true },
          orderBy: { createdAt: 'desc' }
        })
        data = equipos.map(e => ({
          Tipo: e.tipo,
          Marca: e.marca,
          Modelo: e.modelo,
          Serial: e.serial,
          Estado: e.estado,
          Ubicacion: e.ubicacion || '',
          Dependencia: e.dependencia || '',
          Responsable: e.responsable ? `${e.responsable.nombre} ${e.responsable.apellido}` : ''
        }))
        filename = 'informe_equipos'
        headers = ['Tipo', 'Marca', 'Modelo', 'Serial', 'Estado', 'Ubicacion', 'Dependencia', 'Responsable']
        break

      case 'tickets':
        const tickets = await prisma.ticket.findMany({
          include: { creadoPor: true, asignadoA: true },
          orderBy: { createdAt: 'desc' }
        })
        data = tickets.map(t => ({
          ID: t.id,
          Titulo: t.titulo,
          Estado: t.estado,
          Prioridad: t.prioridad,
          'Creado por': t.creadoPor ? `${t.creadoPor.nombre} ${t.creadoPor.apellido}` : '',
          'Asignado a': t.asignadoA ? `${t.asignadoA.nombre} ${t.asignadoA.apellido}` : '',
          'Fecha creación': new Date(t.createdAt).toLocaleDateString('es-CO')
        }))
        filename = 'informe_tickets'
        headers = ['ID', 'Titulo', 'Estado', 'Prioridad', 'Creado por', 'Asignado a', 'Fecha creación']
        break

      case 'tickets-tecnico':
        const tecnicos = await prisma.user.findMany({
          where: { rol: 'TecnicoN1' }
        })
        const ticketsPorTecnico = await Promise.all(
          tecnicos.map(async (t) => {
            const count = await prisma.ticket.count({ where: { asignadoAId: t.id } })
            return { Tecnico: `${t.nombre} ${t.apellido}`, 'Tickets asignados': count }
          })
        )
        data = ticketsPorTecnico
        filename = 'informe_tickets_tecnico'
        headers = ['Tecnico', 'Tickets asignados']
        break

      case 'prestamos':
        const prestamos = await prisma.prestamo.findMany({
          include: { 
            usuario: true,
            equipoComputo: true,
            periferico: true,
            audiovisual: true
          },
          orderBy: { createdAt: 'desc' }
        })
        data = prestamos.map(p => ({
          ID: p.id,
          Usuario: `${p.usuario.nombre} ${p.usuario.apellido}`,
          Equipo: p.equipoComputo ? `${p.equipoComputo.marca} ${p.equipoComputo.modelo}` :
                  p.periferico ? `${p.periferico.tipo} ${p.periferico.marca}` :
                  p.audiovisual ? `${p.audiovisual.tipo} ${p.audiovisual.marca}` : '',
          Estado: p.estado,
          'Fecha préstamo': new Date(p.fechaPrestamo).toLocaleDateString('es-CO'),
          'Fecha devolución': p.fechaDevolucion ? new Date(p.fechaDevolucion).toLocaleDateString('es-CO') : ''
        }))
        filename = 'informe_prestamos'
        headers = ['ID', 'Usuario', 'Equipo', 'Estado', 'Fecha préstamo', 'Fecha devolución']
        break

      case 'auditorio':
        const reservas = await prisma.reservaAuditorio.findMany({
          orderBy: { fechaInicio: 'desc' }
        })
        data = reservas.map(r => ({
          ID: r.id,
          Evento: r.evento,
          Solicitante: r.solicitante,
          Dependencia: r.dependencia,
          'Fecha inicio': new Date(r.fechaInicio).toLocaleString('es-CO'),
          'Fecha fin': new Date(r.fechaFin).toLocaleString('es-CO'),
          Estado: r.estado
        }))
        filename = 'informe_auditorio'
        headers = ['ID', 'Evento', 'Solicitante', 'Dependencia', 'Fecha inicio', 'Fecha fin', 'Estado']
        break

      case 'estadisticas':
        const [
          totalEquipos,
          totalTickets,
          ticketsAbiertos,
          ticketsCerrados,
          totalPrestamos,
          prestamosActivos,
          totalFuncionarios,
          totalUsuarios
        ] = await Promise.all([
          prisma.equipoComputo.count(),
          prisma.ticket.count(),
          prisma.ticket.count({ where: { estado: { in: ['Abierto', 'EnProceso'] } } }),
          prisma.ticket.count({ where: { estado: 'Cerrado' } }),
          prisma.prestamo.count(),
          prisma.prestamo.count({ where: { estado: 'Aprobado', fechaDevolucion: null } }),
          prisma.funcionario.count(),
          prisma.user.count()
        ])
        data = [
          { Metrica: 'Total Equipos', Valor: totalEquipos },
          { Metrica: 'Total Tickets', Valor: totalTickets },
          { Metrica: 'Tickets Abiertos/En Proceso', Valor: ticketsAbiertos },
          { Metrica: 'Tickets Cerrados', Valor: ticketsCerrados },
          { Metrica: 'Total Préstamos', Valor: totalPrestamos },
          { Metrica: 'Préstamos Activos', Valor: prestamosActivos },
          { Metrica: 'Total Funcionarios', Valor: totalFuncionarios },
          { Metrica: 'Total Usuarios', Valor: totalUsuarios }
        ]
        filename = 'informe_estadisticas'
        headers = ['Metrica', 'Valor']
        break

      case 'perifericos':
        const perifericos = await prisma.periferico.findMany({
          orderBy: { createdAt: 'desc' }
        })
        data = perifericos.map(p => ({
          Tipo: p.tipo,
          Marca: p.marca,
          Modelo: p.modelo,
          Serial: p.serial || '',
          Color: p.color || '',
          Estado: p.estado,
          Ubicacion: p.ubicacion || ''
        }))
        filename = 'informe_perifericos'
        headers = ['Tipo', 'Marca', 'Modelo', 'Serial', 'Color', 'Estado', 'Ubicacion']
        break

      case 'audiovisuales':
        const audiovisuales = await prisma.equipoAudiovisual.findMany({
          orderBy: { createdAt: 'desc' }
        })
        data = audiovisuales.map(a => ({
          Tipo: a.tipo,
          Marca: a.marca,
          Modelo: a.modelo,
          Serial: a.serial,
          Estado: a.estado,
          Ubicacion: a.ubicacion || ''
        }))
        filename = 'informe_audiovisuales'
        headers = ['Tipo', 'Marca', 'Modelo', 'Serial', 'Estado', 'Ubicacion']
        break

      default:
        return NextResponse.json({ error: 'Tipo de informe no válido' }, { status: 400 })
    }

    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}.csv"`
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
