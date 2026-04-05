# Sapore Italiano - Backend API

Backend para el sistema de registro de empleados de **Sapore Italiano**.

## 🛠️ Tecnologías

- Node.js + Express
- Baserow (base de datos)
- JWT Authentication

## 🚀 Endpoints

### Empleados
- `GET /api/empleados` - Listar empleados
- `POST /api/empleados` - Crear empleado
- `PATCH /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado

### Nóminas
- `GET /api/nominas` - Listar nóminas
- `GET /api/nominas/periodo/:mes/:ano` - Nóminas por período

### Horarios
- `GET /api/horarios` - Listar registros
- `POST /api/horarios` - Registrar fichaje
- `GET /api/horarios/hoy` - Fichajes de hoy

### Stats
- `GET /api/stats` - Estadísticas generales
- `GET /api/health` - Health check

## 🔧 Variables de entorno

```env
BASEROW_URL=http://localhost:8080
BASEROW_EMAIL=tu@email.com
BASEROW_PASSWORD=tu_password
PORT=3003
```

## 🚀 Deploy

```bash
npm install
pm2 start index.js --name sapore-backend
```

---

*Parte del sistema Sapore Italiano*
