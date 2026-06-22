"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Plus, Trash2 } from "lucide-react"

export default function Compras() {
  const { compras, addCompra, deleteCompra, proveedores, productos } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [detalles, setDetalles] = useState<any[]>([])
  const [formData, setFormData] = useState({
    proveedorId: "",
  })
  const [filterProveedor, setFilterProveedor] = useState("")
  const [dateRange, setDateRange] = useState({ inicio: "", fin: "" })

  const filteredCompras = compras.filter((c) => {
    const matchProveedor = !filterProveedor || c.proveedorId === filterProveedor
    const matchDate = (!dateRange.inicio || c.fecha >= dateRange.inicio) && (!dateRange.fin || c.fecha <= dateRange.fin)
    return matchProveedor && matchDate
  })

  const handleAddDetalle = () => {
    setDetalles([...detalles, { productoId: "", cantidad: 0, precioUnitario: 0 }])
  }

  const handleSave = () => {
    if (!formData.proveedorId || detalles.length === 0) {
      alert("Selecciona proveedor y agrega productos")
      return
    }

    const total = detalles.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0)
    const compraDetalles = detalles.map((d) => ({
      ...d,
      subtotal: d.cantidad * d.precioUnitario,
    }))

    addCompra({
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      proveedorId: formData.proveedorId,
      total,
      detalles: compraDetalles,
    })

    setDetalles([])
    setFormData({ proveedorId: "" })
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Compras</h2>
          <p className="text-sm text-muted-foreground">{filteredCompras.length} compras registradas</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true)
            setDetalles([])
            setFormData({ proveedorId: "" })
          }}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Registrar Compra
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Proveedor</label>
            <select
              value={filterProveedor}
              onChange={(e) => setFilterProveedor(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Todos los proveedores</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Desde</label>
            <input
              type="date"
              value={dateRange.inicio}
              onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hasta</label>
            <input
              type="date"
              value={dateRange.fin}
              onChange={(e) => setDateRange({ ...dateRange, fin: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </Card>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-4">Nueva Compra</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Proveedor</label>
              <select
                value={formData.proveedorId}
                onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Productos</label>
                <Button size="sm" variant="outline" onClick={handleAddDetalle}>
                  + Agregar producto
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {detalles.map((detalle, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <select
                        value={detalle.productoId}
                        onChange={(e) => {
                          const newDetalles = [...detalles]
                          newDetalles[idx].productoId = e.target.value
                          setDetalles(newDetalles)
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      >
                        <option value="">Seleccionar producto</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        placeholder="Cant"
                        value={detalle.cantidad}
                        onChange={(e) => {
                          const newDetalles = [...detalles]
                          newDetalles[idx].cantidad = Number.parseInt(e.target.value) || 0
                          setDetalles(newDetalles)
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Precio"
                        value={detalle.precioUnitario}
                        onChange={(e) => {
                          const newDetalles = [...detalles]
                          newDetalles[idx].precioUnitario = Number.parseFloat(e.target.value) || 0
                          setDetalles(newDetalles)
                        }}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetalles(detalles.filter((_, i) => i !== idx))}
                      className="text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-right font-semibold text-lg">
                Total: C${detalles.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                Guardar Compra
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Proveedor</th>
                <th className="text-center p-3">Productos</th>
                <th className="text-right p-3">Total</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompras.length > 0 ? (
                filteredCompras.map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3">{c.fecha}</td>
                    <td className="p-3">{proveedores.find((p) => p.id === c.proveedorId)?.nombre}</td>
                    <td className="text-center p-3">{c.detalles.length}</td>
                    <td className="text-right p-3 font-semibold">C${c.total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm("¿Deseas anular esta compra?")) deleteCompra(c.id)
                        }}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" /> Anular
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Sin compras registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
