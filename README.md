# Sistema SaveURL - Gestor de Enlaces

Un sistema web completo para guardar, organizar y gestionar URLs temporalmente. Desarrollado con Laravel (backend) y React (frontend).

## Características Principales

### Gestión de Posts
- **CRUD completo** de posts con título, URL e imagen
- **Sistema de favoritos** para marcar enlaces importantes
- **Edición en línea** de título, URL e imagen con modales intuitivos
- **Eliminación con confirmación** para evitar pérdidas accidentales

### Sistema de Categorías
- **Crear categorías** con nombre personalizado y colores
- **Editar y eliminar** categorías existentes
- **Asignación múltiple** de categorías por post
- **Filtrado por categoría** para organización eficiente

### Filtros Avanzados
- **Búsqueda por título** en tiempo real
- **Filtro por categoría** específica
- **Solo favoritos** para acceso rápido
- **Combinación de filtros** para búsquedas precisas

### Autenticación y Seguridad
- **Registro e inicio de sesión** con validación robusta
- **Autenticación JWT** con Laravel Sanctum
- **Autorización por usuario** - cada usuario ve solo sus datos
- **Validaciones de formulario** tanto en frontend como backend

## Stack

### Backend
- **Framework**: Laravel 11
- **Base de datos**: MySQL
- **Autenticación**: Laravel Sanctum
- **Validación**: Form Requests personalizados
- **API**: RESTful

### Frontend
- **Framework**: React 19 con Vite
- **Estilos**: Tailwind CSS para diseño moderno y responsivo
- **Iconos**: React Icons para interfaz intuitiva
- **HTTP Client**: Axios para comunicación con API
- **Notificaciones**: React Toastify para feedback al usuario

## Endpoints API


### Autenticación
```
POST /api/register    # Registro de usuario
POST /api/login       # Inicio de sesión
POST /api/logout      # Cerrar sesión
```

### Posts
```
GET    /api/posts              # Listar posts (con filtros)
POST   /api/posts              # Crear post
PUT    /api/posts/{id}         # Actualizar post
DELETE /api/posts/{id}         # Eliminar post
PATCH  /api/posts/{id}/favorite # Toggle favorito
```

### Categorías
```
GET    /api/categories     # Listar categorías
POST   /api/categories     # Crear categoría
PUT    /api/categories/{id} # Actualizar categoría
DELETE /api/categories/{id} # Eliminar categoría
```

## Ejecución

### Prerrequisitos
- PHP 8.1+
- Composer
- Node.js 18+
- Bun o npm

### Backend (Laravel)
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend (React)
```bash
cd frontend-react
bun install
bun run dev
```
