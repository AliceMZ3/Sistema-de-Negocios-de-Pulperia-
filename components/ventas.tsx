"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Plus, Trash2 } from "lucide-react"

export default function Ventas() {
  const { ventas, addVenta, deleteVenta, productos } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [detalles, setDetalles] = useState<any[]>([])
  const [filterDate, setFilterDate] = useState({ inicio: "", fin: "" })

  const filteredVentas = ventas.filter((v) => {
    const matchDate =
      (!filterDate.inicio || v.fecha >= filterDate.inicio) && (!filterDate.fin || v.fecha <= filterDate.fin)
    return matchDate
  })

  const handleAddDetalle = () => {
    setDetalles([...detalles, { productoId: "", cantidad: 0, precioUnitario: 0 }])
  }

  const handleSave = () => {
    if (detalles.length === 0) {
      alert("Agrega al menos un producto")
      return
    }

    const total = detalles.reduce((sum, d) => sum + d.cantidad * d.precioUnitario, 0)
    const ventaDetalles = detalles.map((d) => ({
      ...d,
      subtotal: d.cantidad * d.precioUnitario,
    }))

    addVenta({
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      total,
      detalles: ventaDetalles,
    })

    setDetalles([])
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Ventas</h2>
          <p className="text-sm text-muted-foreground">{filteredVentas.length} ventas registradas</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true)
            setDetalles([])
          }}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Registrar Venta
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Desde</label>
            <input
              type="date"
              value={filterDate.inicio}
              onChange={(e) => setFilterDate({ ...filterDate, inicio: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hasta</label>
            <input
              type="date"
              value={filterDate.fin}
              onChange={(e) => setFilterDate({ ...filterDate, fin: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </Card>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-4">Nueva Venta</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Productos</label>
                <Button size="sm" variant="outline" onClick={handleAddDetalle}>
                  + Agregar producto
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {detalles.map((detalle, idx) => {
                  const producto = productos.find((p) => p.id === detalle.productoId)
                  return (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <select
                          value={detalle.productoId}
                          onChange={(e) => {
                            const newDetalles = [...detalles]
                            newDetalles[idx].productoId = e.target.value
                            const prod = productos.find((p) => p.id === e.target.value)
                            if (prod) newDetalles[idx].precioUnitario = prod.precioVenta
                            setDetalles(newDetalles)
                          }}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        >
                          <option value="">Seleccionar producto</option>
                          {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.nombre} (Stock: {p.stockActual})
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
                  )
                })}
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
                Guardar Venta
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
                <th className="text-center p-3">Artículos</th>
                <th className="text-right p-3">Total</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVentas.length > 0 ? (
                filteredVentas.map((v) => (
                  <tr key={v.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3">{v.fecha}</td>
                    <td className="text-center p-3">{v.detalles.length}</td>
                    <td className="text-right p-3 font-semibold text-accent">C${v.total.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm("¿Deseas anular esta venta?")) deleteVenta(v.id)
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
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Sin ventas registradas
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
