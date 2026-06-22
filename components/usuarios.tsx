"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Plus, ToggleLeft, ToggleRight } from "lucide-react"

export default function Usuarios() {
  const { usuarios, addUsuario, updateUsuario } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "encargado" as "administrador" | "encargado",
    contraseña: "",
    confirmarContraseña: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validatePassword = (password: string): string[] => {
    const errors = []
    if (password.length < 12) errors.push("Mínimo 12 caracteres")
    if (!/[A-Z]/.test(password)) errors.push("Al menos 1 mayúscula")
    if (!/[0-9]/.test(password)) errors.push("Al menos 1 número")
    if (!/[!@#$%^&*]/.test(password)) errors.push("Al menos 1 símbolo (!@#$%^&*)")
    return errors
  }

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.nombre) newErrors.nombre = "El nombre es requerido"
    if (!formData.correo) newErrors.correo = "El correo es requerido"
    if (!editingId && formData.contraseña !== formData.confirmarContraseña) {
      newErrors.contraseña = "Las contraseñas no coinciden"
    }

    const passwordErrors = validatePassword(formData.contraseña)
    if (passwordErrors.length > 0) {
      newErrors.contraseña = passwordErrors.join(", ")
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (editingId) {
      updateUsuario(editingId, {
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
      })
      setEditingId(null)
    } else {
      addUsuario({
        id: Date.now().toString(),
        nombre: formData.nombre,
        correo: formData.correo,
        rol: formData.rol,
        estadoActivo: true,
      })
    }

    setFormData({ nombre: "", correo: "", rol: "encargado", contraseña: "", confirmarContraseña: "" })
    setErrors({})
    setShowForm(false)
  }

  const handleToggleActive = (id: string, estadoActivo: boolean) => {
    updateUsuario(id, { estadoActivo: !estadoActivo })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Usuarios</h2>
          <p className="text-sm text-muted-foreground">{usuarios.length} usuarios registrados</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setFormData({ nombre: "", correo: "", rol: "encargado", contraseña: "", confirmarContraseña: "" })
            setErrors({})
            setShowForm(true)
          }}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="p-6 border-l-4 border-l-primary">
          <h3 className="font-semibold mb-4">{editingId ? "Editar Usuario" : "Nuevo Usuario"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.nombre ? "border-destructive" : "border-border"
                } focus:ring-primary/50`}
              />
              {errors.nombre && <p className="text-xs text-destructive mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correo</label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.correo ? "border-destructive" : "border-border"
                } focus:ring-primary/50`}
              />
              {errors.correo && <p className="text-xs text-destructive mt-1">{errors.correo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value as any })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="encargado">Vendedor</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={formData.contraseña}
                onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.contraseña ? "border-destructive" : "border-border"
                } focus:ring-primary/50`}
              />
              {errors.contraseña && <p className="text-xs text-destructive mt-1">{errors.contraseña}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                value={formData.confirmarContraseña}
                onChange={(e) => setFormData({ ...formData, confirmarContraseña: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            <p>Requisitos de contraseña:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Mínimo 12 caracteres</li>
              <li>Al menos 1 mayúscula</li>
              <li>Al menos 1 número</li>
              <li>Al menos 1 símbolo (!@#$%^&*)</li>
            </ul>
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
                <th className="text-left p-3">Correo</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-center p-3">Estado</th>
                <th className="text-center p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 font-medium">{u.nombre}</td>
                  <td className="p-3">{u.correo}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        u.rol === "administrador" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.rol === "administrador" ? "Administrador" : "Vendedor"}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(u.id, u.estadoActivo)}
                      className="gap-1"
                    >
                      {u.estadoActivo ? (
                        <>
                          <ToggleRight className="w-4 h-4" /> Activo
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" /> Inactivo
                        </>
                      )}
                    </Button>
                  </td>
                  <td className="p-3 text-center">{/* Aquí puedes agregar más botones si es necesario */}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
