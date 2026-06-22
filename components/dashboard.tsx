"use client"

import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Package, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  const { ventas, productos, configuracion } = useAppStore()

  // Calcular ventas de hoy
  const today = new Date().toISOString().split("T")[0]
  const ventasHoy = ventas.filter((v) => v.fecha === today).reduce((sum, v) => sum + v.total, 0)

  // Productos en stock bajo
  const productosStockBajo = productos.filter((p) => p.stockActual <= p.stockMinimo)

  // Últimas 5 ventas
  const ultimasVentas = [...ventas].reverse().slice(0, 5)

  // Gráfico de ventas últimos 7 días
  const ultimosDias = []
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date(Date.now() - i * 86400000).toISOString().split("T")[0]
    const total = ventas.filter((v) => v.fecha === fecha).reduce((sum, v) => sum + v.total, 0)
    ultimosDias.push({ fecha: fecha.split("-")[2], total })
  }

  // Top 5 productos más vendidos
  const productosVendidos: { [key: string]: number } = {}
  ventas.forEach((venta) => {
    venta.detalles.forEach((detalle) => {
      productosVendidos[detalle.productoId] = (productosVendidos[detalle.productoId] || 0) + detalle.cantidad
    })
  })

  const topProductos = Object.entries(productosVendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, cantidad]) => ({
      nombre: productos.find((p) => p.id === id)?.nombre || "Desconocido",
      cantidad,
    }))

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ventas de Hoy</p>
              <p className="text-3xl font-bold text-primary">C${ventasHoy.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-accent">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Productos en Inventario</p>
              <p className="text-3xl font-bold text-accent">{productos.length}</p>
            </div>
            <Package className="w-8 h-8 text-accent/20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-destructive">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Stock Bajo</p>
              <p className="text-3xl font-bold text-destructive">{productosStockBajo.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-destructive/20" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ventas Últimos 7 Días</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ultimosDias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top productos */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top 5 Productos Más Vendidos</h3>
          <div className="space-y-2">
            {topProductos.length > 0 ? (
              topProductos.map((p) => (
                <div key={p.nombre} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <span className="text-sm">{p.nombre}</span>
                  <span className="font-semibold text-primary">{p.cantidad} unidades</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin datos de ventas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Últimas ventas */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Últimas 5 Ventas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Artículos</th>
                <th className="text-right p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {ultimasVentas.length > 0 ? (
                ultimasVentas.map((venta) => (
                  <tr key={venta.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-2">{venta.fecha}</td>
                    <td className="p-2">{venta.detalles.length}</td>
                    <td className="text-right p-2 font-semibold text-primary">C${venta.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    Sin ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Alertas de stock bajo */}
      {productosStockBajo.length > 0 && (
        <Card className="p-6 border-l-4 border-l-destructive bg-destructive/5">
          <h3 className="font-semibold mb-3 text-destructive">⚠️ Productos con Stock Bajo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {productosStockBajo.map((p) => (
              <p key={p.id} className="text-sm">
                <span className="font-medium">{p.nombre}:</span> {p.stockActual}/{p.stockMinimo} unidades
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
