"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Plus, Edit2, Trash2, Search } from "lucide-react"

export default function Proveedores() {
  const { proveedores, addProveedor, updateProveedor, deleteProveedor } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
    notas: "",
  })

  const filteredProveedores = proveedores.filter((p) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSave = () => {
    if (!formData.nombre) {
      alert("El nombre es requerido")
      return
    }

    if (editingId) {
      updateProveedor(editingId, formData)
      setEditingId(null)
    } else {
      addProveedor({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setFormData({ nombre: "", telefono: "", correo: "", direccion: "", notas: "" })
    setShowForm(false)
  }

  const handleEdit = (p: any) => {
    setFormData(p)
    setEditingId(p.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Proveedores</h2>
          <p className="text-sm text-muted-foreground">{filteredProveedores.length} proveedores</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({ nombre: "", telefono: "", correo: "", direccion: "", notas: "" })
            setShowForm(true)
          }}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Proveedor
        </Button>
      </div>

      {/* Filtro */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </Card>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-4">{editingId ? "Editar Proveedor" : "Nuevo Proveedor"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </Card>
      )}

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Teléfono</th>
                <th className="text-left p-3">Correo</th>
                <th className="text-left p-3">Dirección</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProveedores.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 font-medium">{p.nombre}</td>
                  <td className="p-3">{p.telefono}</td>
                  <td className="p-3">{p.correo}</td>
                  <td className="p-3">{p.direccion}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(p)} className="gap-1">
                        <Edit2 className="w-3 h-3" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("¿Deseas eliminar este proveedor?")) deleteProveedor(p.id)
                        }}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProveedores.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No hay proveedores</div>
          )}
        </div>
      </Card>
    </div>
  )
}
