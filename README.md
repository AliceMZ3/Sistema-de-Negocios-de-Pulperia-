# Sistema-de-Negocios-de-Pulperia-
A comprehensive web-based inventory management system for small retail businesses and grocery stores. Manage products, track purchases and sales, handle suppliers, and generate detailed analytics. Built with Next.js 16, React 19, and Tailwind CSS.

```markdown
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
```

### Core Functionality

- **Dashboard**: Real-time KPIs including daily sales, product count, low stock alerts, and analytics
- **Products Management**: Create, update, and manage product inventory with pricing and stock levels
- **Purchase Orders**: Record and track purchases from suppliers with automatic stock updates
- **Sales Management**: Process sales transactions with real-time stock deduction
- **Supplier Management**: Maintain supplier information and contact details
- **Reports & Analytics**: Generate insights on sales trends, top products, and inventory status
- **User Management**: Role-based access control (Administrator and Staff)
- **System Configuration**: Customize settings like minimum stock levels and tax rates

### Key Features

- Real-time inventory tracking with low stock alerts
- Automatic stock calculations on purchases and sales
- 7-day sales trend visualization
- Top 5 best-selling products analytics
- Role-based access control (Admin and Encargado/Staff)
- Responsive dashboard with KPI cards
- Complete audit trail for inventory changes
- Multi-user support with different permission levels

## Tech Stack

- **Frontend**: React 19 with Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **UI Components**: Radix UI (extensive component library)
- **Animations**: Tailwind CSS Animate

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Default Login Credentials

The system comes with pre-configured test users:

- **Administrator**: 
  - Email: `admin@pulperia.com`
  - Role: Administrador (full access)

- **Staff/Encargado**:
  - Email: `vendedor@pulperia.com`
  - Role: Encargado (sales and limited management)

## Project Structure

```
inventory-management/
├── app/
│   ├── page.tsx              # Main app entry point
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── dashboard.tsx         # Dashboard overview
│   ├── productos.tsx         # Product management
│   ├── compras.tsx           # Purchase orders
│   ├── ventas.tsx            # Sales transactions
│   ├── proveedores.tsx       # Supplier management
│   ├── reportes.tsx          # Reports and analytics
│   ├── usuarios.tsx          # User management (admin only)
│   ├── configuracion.tsx     # System configuration
│   ├── login.tsx             # Login page
│   ├── layout.tsx            # Navigation layout
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── store.ts              # Zustand store (state management)
│   └── utils.ts              # Utility functions
└── package.json
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Usage

### Managing Products

1. Navigate to "Productos" (Products)
2. Click "Add Product" to create a new product
3. Fill in product details: name, category, cost, sale price, minimum stock
4. Products automatically track stock based on purchases and sales

### Recording Sales

1. Go to "Ventas" (Sales)
2. Click "New Sale"
3. Add products to the sale with quantities
4. Confirm to automatically deduct from inventory

### Recording Purchases

1. Navigate to "Compras" (Purchases)
2. Select a supplier
3. Add products with quantities and prices
4. Confirm to automatically increase inventory

### Viewing Reports

1. Go to "Reportes" (Reports)
2. View sales trends, top products, and inventory status
3. Export or print reports as needed

### Managing Users

1. Navigate to "Usuarios" (Users) - Admin only
2. Create new users and assign roles
3. Edit or deactivate user accounts

## Data Storage

Currently, the application uses **in-memory state management** with Zustand. All data is stored in the browser's memory and will be reset on page refresh.

### For Production Deployment

To persist data in a production environment, integrate with:
- **Database**: PostgreSQL, MongoDB, or similar
- **Backend API**: Create API endpoints for CRUD operations
- **Authentication**: Implement proper user authentication system

## Features Roadmap

- Database integration for persistent data storage
- Export reports to PDF/Excel
- Advanced filtering and search
- Batch operations
- Inventory movement history
- Multi-location support
- Integration with payment systems
- Mobile application

## Accessibility

This application is built with accessibility in mind:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly components

## Performance

- Optimized with Next.js server-side rendering
- Component-level code splitting
- Efficient state management with Zustand
- Tailwind CSS for minimal CSS output
- Image optimization
