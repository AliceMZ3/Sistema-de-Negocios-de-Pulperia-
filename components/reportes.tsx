"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download } from "lucide-react"

export default function Reportes() {
  const { ventas, compras, productos, configuracion } = useAppStore()
  const [tab, setTab] = useState<"ventas" | "compras" | "inventario">("ventas")
  const [dateRange, setDateRange] = useState({ inicio: "", fin: "" })

  const today = new Date()
  const primeroDeMes = new Date(today.getFullYear(), today.getMonth(), 1)
  const mesActual = primeroDeMes.toISOString().split("T")[0].substring(0, 7)

  const filteredVentas = ventas.filter((v) => {
    const matchDate = (!dateRange.inicio || v.fecha >= dateRange.inicio) && (!dateRange.fin || v.fecha <= dateRange.fin)
    return matchDate
  })

  const filteredCompras = compras.filter((c) => {
    const matchDate = (!dateRange.inicio || c.fecha >= dateRange.inicio) && (!dateRange.fin || c.fecha <= dateRange.fin)
    return matchDate
  })

  const totalVentas = filteredVentas.reduce((sum, v) => sum + v.total, 0)
  const totalCompras = filteredCompras.reduce((sum, c) => sum + c.total, 0)
  const ventasMes = ventas.filter((v) => v.fecha.startsWith(mesActual)).reduce((sum, v) => sum + v.total, 0)
  const impuestoMes = ventasMes * (configuracion.porcentajeImpuesto / 100)

  // Top productos más vendidos
  const productosVendidos: { [key: string]: { cantidad: number; ingresos: number } } = {}
  filteredVentas.forEach((venta) => {
    venta.detalles.forEach((detalle) => {
      if (!productosVendidos[detalle.productoId]) {
        productosVendidos[detalle.productoId] = { cantidad: 0, ingresos: 0 }
      }
      productosVendidos[detalle.productoId].cantidad += detalle.cantidad
      productosVendidos[detalle.productoId].ingresos += detalle.subtotal
    })
  })

  const topProductos = Object.entries(productosVendidos)
    .map(([id, data]) => ({
      nombre: productos.find((p) => p.id === id)?.nombre || "Desconocido",
      ...data,
    }))
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 5)

  // Ventas por categoría
  const ventasPorCategoria: { [key: string]: number } = {}
  filteredVentas.forEach((venta) => {
    venta.detalles.forEach((detalle) => {
      const prod = productos.find((p) => p.id === detalle.productoId)
      if (prod) {
        ventasPorCategoria[prod.categoria] = (ventasPorCategoria[prod.categoria] || 0) + detalle.subtotal
      }
    })
  })

  const categoriaData = Object.entries(ventasPorCategoria).map(([categoria, monto]) => ({
    categoria: categoria.substring(0, 10),
    monto,
  }))

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"]

  const handleDownloadPDF = () => {
    alert("Descargando PDF... (simulado)")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reportes</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(["ventas", "compras", "inventario"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "ventas" && "Ventas"}
            {t === "compras" && "Compras"}
            {t === "inventario" && "Inventario"}
          </button>
        ))}
      </div>

      {/* Filtros de fecha */}
      {tab !== "inventario" && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="flex items-end">
              <Button onClick={handleDownloadPDF} className="w-full bg-accent hover:bg-accent/90 gap-2">
                <Download className="w-4 h-4" /> Descargar PDF
              </Button>
            </div>
          </div>
        </Card>
      )}

      {tab === "ventas" && (
        <div className="space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground mb-1">Total Vendido</p>
              <p className="text-3xl font-bold text-primary">C${totalVentas.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-2">{filteredVentas.length} transacciones</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-accent">
              <p className="text-sm text-muted-foreground mb-1">Ventas Este Mes</p>
              <p className="text-3xl font-bold text-accent">C${ventasMes.toFixed(2)}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-destructive">
              <p className="text-sm text-muted-foreground mb-1">Impuesto Calculado</p>
              <p className="text-3xl font-bold text-destructive">C${impuestoMes.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-2">{configuracion.porcentajeImpuesto}%</p>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Top 5 Productos Más Vendidos</h3>
              <div className="space-y-3">
                {topProductos.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center pb-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">{p.cantidad} unidades</p>
                    </div>
                    <p className="font-semibold text-primary">C${p.ingresos.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </Card>

            {categoriaData.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Ventas por Categoría</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoriaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, monto }) => `${categoria}: C$${(monto / 1000).toFixed(0)}k`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="monto"
                    >
                      {categoriaData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `C$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          {/* Tabla de ventas */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Detalle de Ventas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-3">Fecha</th>
                    <th className="text-center p-3">Artículos</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVentas.length > 0 ? (
                    filteredVentas.map((v) => (
                      <tr key={v.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3">{v.fecha}</td>
                        <td className="text-center p-3">{v.detalles.length}</td>
                        <td className="text-right p-3 font-semibold">C${v.total.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground">
                        Sin datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === "compras" && (
        <div className="space-y-4">
          <Card className="p-6 border-l-4 border-l-primary">
            <p className="text-sm text-muted-foreground mb-1">Total Comprado</p>
            <p className="text-3xl font-bold text-primary">C${totalCompras.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">{filteredCompras.length} compras</p>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Historial de Compras</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-3">Fecha</th>
                    <th className="text-center p-3">Productos</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompras.length > 0 ? (
                    filteredCompras.map((c) => (
                      <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3">{c.fecha}</td>
                        <td className="text-center p-3">{c.detalles.length}</td>
                        <td className="text-right p-3 font-semibold">C${c.total.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-muted-foreground">
                        Sin datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab === "inventario" && (
        <div className="space-y-4">
          <Card className="p-6 border-l-4 border-l-primary">
            <p className="text-sm text-muted-foreground mb-1">Valor Total de Inventario</p>
            <p className="text-3xl font-bold text-primary">
              C${productos.reduce((sum, p) => sum + p.stockActual * p.precioCompra, 0).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{productos.length} productos</p>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-3">Producto</th>
                    <th className="text-right p-3">Stock</th>
                    <th className="text-right p-3">P. Unitario</th>
                    <th className="text-right p-3">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-3">{p.nombre}</td>
                      <td className="text-right p-3">{p.stockActual}</td>
                      <td className="text-right p-3">C${p.precioCompra.toFixed(2)}</td>
                      <td className="text-right p-3 font-semibold">C${(p.stockActual * p.precioCompra).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
