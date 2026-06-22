"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

export default function Configuracion() {
  const { configuracion, updateConfiguracion, ventas } = useAppStore()
  const [formData, setFormData] = useState(configuracion)

  const handleSave = () => {
    updateConfiguracion(formData)
    alert("Configuración guardada exitosamente")
  }

  const today = new Date()
  const mesActual = today.toISOString().split("T")[0].substring(0, 7)
  const ventasMes = ventas.filter((v) => v.fecha.startsWith(mesActual)).reduce((sum, v) => sum + v.total, 0)
  const impuestoEstimado = ventasMes * (formData.porcentajeImpuesto / 100)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Configuración</h2>

      {/* Parámetros */}
      <Card className="p-6 border-l-4 border-l-primary">
        <h3 className="font-semibold mb-4">Parámetros del Sistema</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Stock Mínimo Global por Defecto</label>
            <input
              type="number"
              value={formData.stockMinimoDefecto}
              onChange={(e) => setFormData({ ...formData, stockMinimoDefecto: Number.parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">Se aplica al crear nuevos productos</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Porcentaje de Impuesto (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.porcentajeImpuesto}
              onChange={(e) => setFormData({ ...formData, porcentajeImpuesto: Number.parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">Se calcula sobre el total de ventas mensuales</p>
          </div>

          <div className="pt-4 border-t border-border">
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Card>

      {/* Resumen fiscal */}
      <Card className="p-6 border-l-4 border-l-accent">
        <h3 className="font-semibold mb-4">Resumen Fiscal Actual</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Ventas de {mesActual}</p>
            <p className="text-2xl font-bold text-primary">C${ventasMes.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Impuesto Estimado</p>
            <p className="text-2xl font-bold text-accent">C${impuestoEstimado.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">{formData.porcentajeImpuesto}% sobre ventas</p>
          </div>
        </div>
      </Card>

      {/* Información */}
      <Card className="p-6 bg-muted/30">
        <h3 className="font-semibold mb-2">ℹ️ Información del Sistema</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Sistema de Compras, Ventas e Inventario para Pulperías</li>
          <li>• Versión 1.0</li>
          <li>• Todos los datos se guardan localmente en tu navegador</li>
          <li>• Los datos se perderán si limpias el caché o usas modo incógnito</li>
        </ul>
      </Card>
    </div>
  )
}
