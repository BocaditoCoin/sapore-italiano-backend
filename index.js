const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Configuración Baserow
const BASEROW_URL = process.env.BASEROW_URL || 'http://91.134.140.213:8080'
const BASEROW_EMAIL = process.env.BASEROW_EMAIL || 'hdcpy2019@gmail.com'
const BASEROW_PASSWORD = process.env.BASEROW_PASSWORD || 'edgar123'

// IDs de tablas en Baserow (Sapore Italiano)
const TABLES = {
  empleados: 752,
  nominas: 753,
  registroHorarios: 751,
  datosClientes: 750
}

let jwtToken = null
let tokenExpiry = null

// Función para obtener token JWT
async function getBaserowToken() {
  if (jwtToken && tokenExpiry && Date.now() < tokenExpiry) {
    return jwtToken
  }
  
  try {
    const response = await axios.post(`${BASEROW_URL}/api/user/token-auth/`, {
      email: BASEROW_EMAIL,
      password: BASEROW_PASSWORD
    })
    jwtToken = response.data.token
    tokenExpiry = Date.now() + 55 * 60 * 1000 // 55 minutos
    return jwtToken
  } catch (error) {
    console.error('Error obteniendo token:', error.message)
    throw error
  }
}

// Función helper para llamadas a Baserow
async function baserowRequest(method, path, data = null) {
  const token = await getBaserowToken()
  const config = {
    method,
    url: `${BASEROW_URL}${path}`,
    headers: {
      'Authorization': `JWT ${token}`,
      'Content-Type': 'application/json'
    }
  }
  if (data) config.data = data
  return axios(config)
}

// ==================== EMPLEADOS ====================

// Obtener todos los empleados
app.get('/api/empleados', async (req, res) => {
  try {
    const response = await baserowRequest('GET', `/api/database/rows/table/${TABLES.empleados}/?user_field_names=true&size=100`)
    res.json(response.data.results || [])
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Error obteniendo empleados' })
  }
})

// Obtener empleado por ID
app.get('/api/empleados/:id', async (req, res) => {
  try {
    const response = await baserowRequest('GET', `/api/database/rows/table/${TABLES.empleados}/${req.params.id}/?user_field_names=true`)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo empleado' })
  }
})

// Crear empleado
app.post('/api/empleados', async (req, res) => {
  try {
    const { uuid } = require('crypto').randomUUID()
    const data = {
      ...req.body,
      UUID: uuid || require('crypto').randomUUID(),
      'Creado en': new Date().toISOString().split('T')[0],
      'Modificado en': new Date().toISOString().split('T')[0]
    }
    const response = await baserowRequest('POST', `/api/database/rows/table/${TABLES.empleados}/?user_field_names=true`, data)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Error creando empleado' })
  }
})

// Actualizar empleado
app.patch('/api/empleados/:id', async (req, res) => {
  try {
    const data = {
      ...req.body,
      'Modificado en': new Date().toISOString().split('T')[0]
    }
    const response = await baserowRequest('PATCH', `/api/database/rows/table/${TABLES.empleados}/${req.params.id}/?user_field_names=true`, data)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando empleado' })
  }
})

// Eliminar empleado
app.delete('/api/empleados/:id', async (req, res) => {
  try {
    await baserowRequest('DELETE', `/api/database/rows/table/${TABLES.empleados}/${req.params.id}/`)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando empleado' })
  }
})

// ==================== NÓMINAS ====================

// Obtener todas las nóminas
app.get('/api/nominas', async (req, res) => {
  try {
    const response = await baserowRequest('GET', `/api/database/rows/table/${TABLES.nominas}/?user_field_names=true&size=100`)
    res.json(response.data.results || [])
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo nóminas' })
  }
})

// Obtener nóminas por mes/año
app.get('/api/nominas/periodo/:mes/:ano', async (req, res) => {
  try {
    const { mes, ano } = req.params
    const response = await baserowRequest('GET', `/api/database/rows/table/${TABLES.nominas}/?user_field_names=true&filter__Periodo_mes__equal=${mes}&filter__Periodo_ano__equal=${ano}`)
    res.json(response.data.results || [])
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo nóminas' })
  }
})

// Crear nómina
app.post('/api/nominas', async (req, res) => {
  try {
    const data = {
      ...req.body,
      UUID: require('crypto').randomUUID(),
      'Creado en': new Date().toISOString().split('T')[0],
      'Modificado en': new Date().toISOString().split('T')[0]
    }
    const response = await baserowRequest('POST', `/api/database/rows/table/${TABLES.nominas}/?user_field_names=true`, data)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Error creando nómina' })
  }
})

// ==================== REGISTRO DE HORARIOS ====================

// Obtener todos los registros
app.get('/api/horarios', async (req, res) => {
  try {
    const response = await baserowRequest('GET', `/api/database/rows/table/${TABLES.registroHorarios}/?user_field_names=true&size=100`)
    res.json(response.data.results || [])
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo horarios' })
  }
})

// Registrar fichaje
app.post('/api/horarios', async (req, res) => {
  try {
    const data = {
      ...req.body,
      UUID: require('crypto').randomUUID(),
      'Creado en': new Date().toISOString().split('T')[0],
      'Modificado en': new Date().toISOString().split('T')[0]
    }
    const response = await baserowRequest('POST', `/api/database/rows/table/${TABLES.registroHorarios}/?user_field_names=true`, data)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Error registrando horario' })
  }
})

// Obtener fichajes de hoy
app.get('/api/horarios/hoy', async (req, res) => {
  try {
    const hoy = new Date().toISOString().split('T')[0]
    const response = await baserowRequest('GET', `/api/database/rows/table/${TABLES.registroHorarios}/?user_field_names=true&size=100&filter__Fecha__equal=${hoy}`)
    res.json(response.data.results || [])
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo horarios de hoy' })
  }
})

// ==================== ESTADÍSTICAS ====================

app.get('/api/stats', async (req, res) => {
  try {
    const [empleados, horarios, nominas] = await Promise.all([
      baserowRequest('GET', `/api/database/rows/table/${TABLES.empleados}/?user_field_names=true`),
      baserowRequest('GET', `/api/database/rows/table/${TABLES.registroHorarios}/?user_field_names=true`),
      baserowRequest('GET', `/api/database/rows/table/${TABLES.nominas}/?user_field_names=true`)
    ])
    
    const hoy = new Date().toISOString().split('T')[0]
    const fichajesHoy = (horarios.data.results || []).filter(h => h.Fecha === hoy)
    
    res.json({
      empleadosActivos: (empleados.data.results || []).filter(e => e.Activo).length,
      fichajesHoy: fichajesHoy.length,
      totalNominas: (nominas.data.results || []).length,
      ultimosFichajes: fichajesHoy.slice(-5)
    })
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`🚀 Sapore Backend corriendo en puerto ${PORT}`)
  console.log(`📡 Conectando a Baserow en ${BASEROW_URL}`)
})
