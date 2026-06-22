import { create } from "zustand"

interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: "administrador" | "encargado"
  estadoActivo: boolean
}

interface Producto {
  id: string
  nombre: string
  categoria: string
  precioCompra: number
  precioVenta: number
  stockActual: number
  stockMinimo: number
  proveedorPrincipalId?: string
  fechaCreacion: string
  fechaActualizacion: string
}

interface Proveedor {
  id: string
  nombre: string
  telefono: string
  correo: string
  direccion: string
  notas: string
}

interface CompraDetalle {
  productoId: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface Compra {
  id: string
  fecha: string
  proveedorId: string
  total: number
  detalles: CompraDetalle[]
}

interface VentaDetalle {
  productoId: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

interface Venta {
  id: string
  fecha: string
  total: number
  detalles: VentaDetalle[]
}

interface Configuracion {
  stockMinimoDefecto: number
  porcentajeImpuesto: number
}

interface AppState {
  currentUser: Usuario | null
  usuarios: Usuario[]
  productos: Producto[]
  proveedores: Proveedor[]
  compras: Compra[]
  ventas: Venta[]
  configuracion: Configuracion

  setCurrentUser: (user: Usuario | null) => void
  logout: () => void

  // Productos
  addProducto: (producto: Producto) => void
  updateProducto: (id: string, producto: Partial<Producto>) => void
  deleteProducto: (id: string) => void

  // Proveedores
  addProveedor: (proveedor: Proveedor) => void
  updateProveedor: (id: string, proveedor: Partial<Proveedor>) => void
  deleteProveedor: (id: string) => void

  // Compras
  addCompra: (compra: Compra) => void
  deleteCompra: (id: string) => void

  // Ventas
  addVenta: (venta: Venta) => void
  deleteVenta: (id: string) => void

  // Usuarios
  addUsuario: (usuario: Usuario) => void
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void

  // Configuración
  updateConfiguracion: (config: Partial<Configuracion>) => void
}

const mockUsuarios: Usuario[] = [
  { id: "1", nombre: "Admin", correo: "admin@pulperia.com", rol: "administrador", estadoActivo: true },
  { id: "2", nombre: "Vendedor", correo: "vendedor@pulperia.com", rol: "encargado", estadoActivo: true },
]

const mockProductos: Producto[] = [
  {
    id: "1",
    nombre: "Arroz",
    categoria: "Granos",
    precioCompra: 15,
    precioVenta: 20,
    stockActual: 50,
    stockMinimo: 10,
    proveedorPrincipalId: "1",
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-01",
  },
  {
    id: "2",
    nombre: "Frijoles",
    categoria: "Granos",
    precioCompra: 12,
    precioVenta: 18,
    stockActual: 8,
    stockMinimo: 10,
    proveedorPrincipalId: "1",
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-01",
  },
  {
    id: "3",
    nombre: "Aceite",
    categoria: "Aceites",
    precioCompra: 45,
    precioVenta: 65,
    stockActual: 30,
    stockMinimo: 5,
    proveedorPrincipalId: "2",
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-01",
  },
  {
    id: "4",
    nombre: "Sal",
    categoria: "Condimentos",
    precioCompra: 5,
    precioVenta: 8,
    stockActual: 100,
    stockMinimo: 20,
    proveedorPrincipalId: "1",
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-01",
  },
  {
    id: "5",
    nombre: "Azúcar",
    categoria: "Endulzantes",
    precioCompra: 25,
    precioVenta: 35,
    stockActual: 40,
    stockMinimo: 15,
    proveedorPrincipalId: "1",
    fechaCreacion: "2024-01-01",
    fechaActualizacion: "2024-01-01",
  },
]

const mockProveedores: Proveedor[] = [
  {
    id: "1",
    nombre: "Proveedor Global",
    telefono: "2234-5678",
    correo: "contacto@global.com",
    direccion: "Managua",
    notas: "Proveedor principal",
  },
  {
    id: "2",
    nombre: "Distribuidora Central",
    telefono: "2245-8901",
    correo: "info@distrib.com",
    direccion: "Granada",
    notas: "",
  },
]

const mockVentas: Venta[] = [
  {
    id: "1",
    fecha: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    total: 150,
    detalles: [
      { productoId: "1", cantidad: 5, precioUnitario: 20, subtotal: 100 },
      { productoId: "2", cantidad: 5, precioUnitario: 18, subtotal: 90 },
    ],
  },
  {
    id: "2",
    fecha: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    total: 200,
    detalles: [{ productoId: "3", cantidad: 2, precioUnitario: 65, subtotal: 130 }],
  },
]

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  usuarios: mockUsuarios,
  productos: mockProductos,
  proveedores: mockProveedores,
  compras: [],
  ventas: mockVentas,
  configuracion: { stockMinimoDefecto: 10, porcentajeImpuesto: 15 },

  setCurrentUser: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),

  addProducto: (producto) => set((state) => ({ productos: [...state.productos, producto] })),
  updateProducto: (id, updates) =>
    set((state) => ({
      productos: state.productos.map((p) =>
        p.id === id ? { ...p, ...updates, fechaActualizacion: new Date().toISOString().split("T")[0] } : p,
      ),
    })),
  deleteProducto: (id) => set((state) => ({ productos: state.productos.filter((p) => p.id !== id) })),

  addProveedor: (proveedor) => set((state) => ({ proveedores: [...state.proveedores, proveedor] })),
  updateProveedor: (id, updates) =>
    set((state) => ({
      proveedores: state.proveedores.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deleteProveedor: (id) => set((state) => ({ proveedores: state.proveedores.filter((p) => p.id !== id) })),

  addCompra: (compra) =>
    set((state) => {
      const newState = { ...state, compras: [...state.compras, compra] }
      compra.detalles.forEach((detalle) => {
        const productIndex = newState.productos.findIndex((p) => p.id === detalle.productoId)
        if (productIndex !== -1) {
          newState.productos[productIndex].stockActual += detalle.cantidad
        }
      })
      return newState
    }),
  deleteCompra: (id) =>
    set((state) => {
      const compra = state.compras.find((c) => c.id === id)
      if (!compra) return state
      const newProducts = [...state.productos]
      compra.detalles.forEach((detalle) => {
        const productIndex = newProducts.findIndex((p) => p.id === detalle.productoId)
        if (productIndex !== -1) {
          newProducts[productIndex].stockActual -= detalle.cantidad
        }
      })
      return { compras: state.compras.filter((c) => c.id !== id), productos: newProducts }
    }),

  addVenta: (venta) =>
    set((state) => {
      const newProducts = [...state.productos]
      venta.detalles.forEach((detalle) => {
        const productIndex = newProducts.findIndex((p) => p.id === detalle.productoId)
        if (productIndex !== -1) {
          newProducts[productIndex].stockActual -= detalle.cantidad
        }
      })
      return { ventas: [...state.ventas, venta], productos: newProducts }
    }),
  deleteVenta: (id) =>
    set((state) => {
      const venta = state.ventas.find((v) => v.id === id)
      if (!venta) return state
      const newProducts = [...state.productos]
      venta.detalles.forEach((detalle) => {
        const productIndex = newProducts.findIndex((p) => p.id === detalle.productoId)
        if (productIndex !== -1) {
          newProducts[productIndex].stockActual += detalle.cantidad
        }
      })
      return { ventas: state.ventas.filter((v) => v.id !== id), productos: newProducts }
    }),

  addUsuario: (usuario) => set((state) => ({ usuarios: [...state.usuarios, usuario] })),
  updateUsuario: (id, updates) =>
    set((state) => ({
      usuarios: state.usuarios.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),

  updateConfiguracion: (config) =>
    set((state) => ({
      configuracion: { ...state.configuracion, ...config },
    })),
}))
