"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Search, Plus, Edit2, Trash2, AlertCircle } from "lucide-react"

export default function Productos() {
  const { productos, addProducto, updateProducto, deleteProducto, proveedores } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precioCompra: 0,
    precioVenta: 0,
    stockActual: 0,
    stockMinimo: 10,
    proveedorPrincipalId: "",
  })

  const categorias = [...new Set(productos.map((p) => p.categoria))]

  const filteredProductos = productos.filter((p) => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = !filterCategoria || p.categoria === filterCategoria
    return matchSearch && matchCategoria
  })

  const handleSave = () => {
    if (!formData.nombre || !formData.categoria) {
      alert("Por favor completa todos los campos")
      return
    }

    if (formData.precioCompra <= 0 || formData.precioVenta <= 0) {
      alert("Los precios deben ser mayores a 0")
      return
    }

    if (editingId) {
      updateProducto(editingId, {
        ...formData,
        fechaActualizacion: new Date().toISOString().split("T")[0],
      })
      setEditingId(null)
    } else {
      addProducto({
        id: Date.now().toString(),
        ...formData,
        fechaCreacion: new Date().toISOString().split("T")[0],
        fechaActualizacion: new Date().toISOString().split("T")[0],
      })
    }

    setFormData({
      nombre: "",
      categoria: "",
      precioCompra: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 10,
      proveedorPrincipalId: "",
    })
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
          <h2 className="text-2xl font-bold">Inventario de Productos</h2>
          <p className="text-sm text-muted-foreground">{filteredProductos.length} productos encontrados</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({
              nombre: "",
              categoria: "",
              precioCompra: 0,
              precioVenta: 0,
              stockActual: 0,
              stockMinimo: 10,
              proveedorPrincipalId: "",
            })
            setShowForm(true)
          }}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Nombre del producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-4">{editingId ? "Editar Producto" : "Nuevo Producto"}</h3>
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
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio Compra (C$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.precioCompra}
                onChange={(e) => setFormData({ ...formData, precioCompra: Number.parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio Venta (C$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.precioVenta}
                onChange={(e) => setFormData({ ...formData, precioVenta: Number.parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Actual</label>
              <input
                type="number"
                value={formData.stockActual}
                onChange={(e) => setFormData({ ...formData, stockActual: Number.parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Mínimo</label>
              <input
                type="number"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: Number.parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                <th className="text-left p-3">Categoría</th>
                <th className="text-right p-3">P. Compra</th>
                <th className="text-right p-3">P. Venta</th>
                <th className="text-right p-3">Stock</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-border hover:bg-muted/30 ${
                    p.stockActual <= p.stockMinimo ? "bg-destructive/5" : ""
                  }`}
                >
                  <td className="p-3 font-medium flex items-center gap-2">
                    {p.stockActual <= p.stockMinimo && (
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    )}
                    {p.nombre}
                  </td>
                  <td className="p-3">{p.categoria}</td>
                  <td className="text-right p-3">C${p.precioCompra.toFixed(2)}</td>
                  <td className="text-right p-3">C${p.precioVenta.toFixed(2)}</td>
                  <td className="text-right p-3">
                    <span className={p.stockActual <= p.stockMinimo ? "text-destructive font-semibold" : ""}>
                      {p.stockActual}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(p)} className="gap-1">
                        <Edit2 className="w-3 h-3" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("¿Deseas eliminar este producto?")) deleteProducto(p.id)
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
          {filteredProductos.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No hay productos que coincidan</div>
          )}
        </div>
      </Card>
    </div>
  )
}
