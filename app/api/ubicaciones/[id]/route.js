import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

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

export async function GET(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const ubicacion = await prisma.ubicacion.findUnique({
      where: { id: parseInt(id) },
    })

    if (!ubicacion) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json(ubicacion)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (user.rol !== 'Administrador') {
      return NextResponse.json({ error: 'Solo administradores pueden modificar ubicaciones' }, { status: 403 })
    }

    const data = await request.json()

    const ubicacion = await prisma.ubicacion.update({
      where: { id: parseInt(id) },
      data: {
        nombre: data.nombre,
        tipo: data.tipo,
        descripcion: data.descripcion || null,
        activo: Boolean(data.activo),
      },
    })

    return NextResponse.json(ubicacion)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user || user.rol !== 'Administrador') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar ubicaciones' }, { status: 403 })
    }

    const existing = await prisma.ubicacion.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Ubicación no encontrada' }, { status: 404 })
    }

    await prisma.ubicacion.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
