"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppStore } from "@/lib/store"
import { AlertCircle } from "lucide-react"

interface LoginPageProps {
  onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { usuarios, setCurrentUser } = useAppStore()
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = usuarios.find((u) => (u.correo === usuario || u.nombre === usuario) && u.estadoActivo)

    if (user && password.length > 0) {
      setCurrentUser(user)
      onLogin(user)
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 to-fuchsia-700 flex items-center justify-center p-6">
    <Card className="w-full max-w-2xl overflow-hidden border-0 bg-white/10 backdrop-blur-xl shadow-2xl">
      <div className="p-10 text-center">
        {/* Replace the image URL below with your own */}
        <img
          src="YOUR_IMAGE_LINK_HERE"
          alt="Pawk"
          className="w-56 h-56 object-cover rounded-3xl mx-auto shadow-xl border-4 border-white/20"
        />

        <div className="mt-8 space-y-4">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
            I love you so much pawk 💜
          </h1>

          <p className="text-purple-100 text-lg max-w-lg mx-auto leading-relaxed">
            Every moment with you makes everything brighter, happier, and more
            beautiful.
          </p>
        </div>

        <div className="mt-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-purple-100 backdrop-blur-md">
            ✨ Forever and always ✨
          </div>
        </div>
      </div>
    </Card>
  </div>
)
}
