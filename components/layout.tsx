"use client"

import type React from "react"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Layout({ children, currentPage, setCurrentPage }: LayoutProps) {
  const { currentUser, logout } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "productos", label: "Inventario", icon: "📦" },
    { id: "compras", label: "Compras", icon: "🛒" },
    { id: "ventas", label: "Ventas", icon: "💰" },
    { id: "proveedores", label: "Proveedores", icon: "🏢" },
    { id: "reportes", label: "Reportes", icon: "📈" },
    ...(currentUser?.rol === "administrador" ? [{ id: "usuarios", label: "Usuarios", icon: "👥" }] : []),
    { id: "configuracion", label: "Configuración", icon: "⚙️" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-primary text-primary-foreground overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-primary-foreground/20">
          <h1 className="text-xl font-bold">Pulpería 🏪</h1>
          <p className="text-sm opacity-80">Gestión</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? "bg-primary-foreground text-primary font-semibold"
                  : "hover:bg-primary-foreground/10"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{currentUser?.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.rol === "administrador" ? "Administrador" : "Vendedor"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => logout()} className="gap-2">
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  )
}
