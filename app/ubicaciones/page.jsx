'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, Warehouse, Store, School, Home, Building } from 'lucide-react'

const tiposUbicacion = [
  { value: 'IDF', label: 'IDF', icon: Building },
  { value: 'Centro', label: 'Centro', icon: Home },
  { value: 'Ambiente', label: 'Ambiente', icon: Home },
  { value: 'Oficina', label: 'Oficina', icon: Warehouse },
  { value: 'Biblioteca', label: 'Biblioteca', icon: Store },
  { value: 'Aula', label: 'Aula', icon: School },
]

function ModalContent({ nombre, descripcion, formData, setFormData, editData, handleSubmit, onClose }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" {...nombre} required placeholder="Nombre de la ubicación" />
      
      <div>
        <label className="block mb-2 text-sm font-medium text-green-300/90">Tipo</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiposUbicacion.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setFormData({...formData, tipo: t.value})}
              className={`p-3 rounded-lg border text-center transition-all ${
                formData.tipo === t.value 
                  ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                  : 'bg-slate-800/50 border-green-500/20 text-slate-400 hover:border-green-500/30'
              }`}
            >
              <t.icon size={20} className="mx-auto mb-1" />
              <span className="text-sm">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Input label="Descripción" {...descripcion} placeholder="Descripción opcional" />

      {editData && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.activo}
            onChange={(e) => setFormData({...formData, activo: e.target.checked})}
            className="w-4 h-4 rounded border-green-500/30 bg-slate-800 text-green-500 focus:ring-green-500/50"
          />
          <span className="text-sm text-green-300/90">Activo</span>
        </label>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {editData ? 'Actualizar' : 'Crear'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export default function UbicacionesPage() {
  const [ubicaciones, setUbicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const nombre = useUpperCase('')
  const descripcion = useUpperCase('')

  const [formData, setFormData] = useState({
    tipo: 'Ambiente',
    activo: true,
  })

  useEffect(() => {
    fetchUbicaciones()
  }, [])

  const fetchUbicaciones = async () => {
    try {
      const res = await fetch('/api/ubicaciones', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUbicaciones(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editData ? `/api/ubicaciones/${editData.id}` : '/api/ubicaciones'
      const method = editData ? 'PUT' : 'POST'
      
      const bodyData = {
        nombre: nombre.value,
        tipo: formData.tipo,
        descripcion: descripcion.value || null,
        activo: formData.activo,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })

      if (res.ok) {
        setModalOpen(false)
        setEditData(null)
        resetForm()
        fetchUbicaciones()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (ubicacion) => {
    setEditData(ubicacion)
    nombre.setValue(ubicacion.nombre)
    descripcion.setValue(ubicacion.descripcion || '')
    setFormData({
      tipo: ubicacion.tipo,
      activo: ubicacion.activo,
    })
    setModalOpen(true)
  }

  const handleDelete = async (row) => {
    const id = row.id
    if (!confirm('¿Estás seguro de eliminar esta ubicación?')) return
    try {
      const res = await fetch(`/api/ubicaciones/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUbicaciones()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    nombre.setValue('')
    descripcion.setValue('')
    setFormData({
      tipo: 'Ambiente',
      activo: true,
    })
  }

  const openModal = () => {
    resetForm()
    setEditData(null)
    setModalOpen(true)
  }

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipo', header: 'Tipo' },
    { 
      key: 'descripcion', 
      header: 'Descripción',
      render: (val, row) => (row && row.descripcion) || '-'
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (val, row) => (
        <span className={`px-2 py-1 rounded text-xs ${val ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {val ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
  ]

  return (
    <CRUDBase title="Ubicaciones" subtitle="Gestión de ambientes, oficinas, bibliotecas y aulas">
      <div className="mb-6 flex justify-end">
        <Button onClick={openModal}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nueva Ubicación
          </span>
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={ubicaciones} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={['nombre', 'tipo', 'descripcion']}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Ubicación' : 'Nueva Ubicación'}>
        <ModalContent 
          nombre={nombre} 
          descripcion={descripcion} 
          formData={formData} 
          setFormData={setFormData} 
          editData={editData}
          handleSubmit={handleSubmit}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </CRUDBase>
  )
}
