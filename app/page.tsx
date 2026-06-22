"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import Dashboard from "@/components/dashboard"
import Productos from "@/components/productos"
import Compras from "@/components/compras"
import Ventas from "@/components/ventas"
import Proveedores from "@/components/proveedores"
import Reportes from "@/components/reportes"
import Usuarios from "@/components/usuarios"
import Configuracion from "@/components/configuracion"
import LoginPage from "@/components/login"
import { useAppStore } from "@/lib/store"

export default function Home() {
  const { currentUser, setCurrentUser } = useAppStore()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) return null

  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "productos":
        return <Productos />
      case "compras":
        return <Compras />
      case "ventas":
        return <Ventas />
      case "proveedores":
        return <Proveedores />
      case "reportes":
        return <Reportes />
      case "usuarios":
        return currentUser.rol === "administrador" ? <Usuarios /> : <Dashboard />
      case "configuracion":
        return <Configuracion />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}
