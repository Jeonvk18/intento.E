const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const CLAVE_TOKEN = 'encurtidos_admin_token';

export const obtenerToken = () => localStorage.getItem(CLAVE_TOKEN);
export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token);
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN);

async function pedir(ruta, { metodo = 'GET', cuerpo, conAuth = false } = {}) {
  const cabeceras = { 'Content-Type': 'application/json' };

  if (conAuth) {
    const token = obtenerToken();
    if (token) cabeceras.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.error || 'Ocurrió un error. Intenta de nuevo.');
    error.estado = respuesta.status;
    throw error;
  }

  return datos;
}

/* ---------- Público ---------- */
export const listarProductos = () => pedir('/productos');
export const crearPedido = (pedido) => pedir('/pedidos', { metodo: 'POST', cuerpo: pedido });
export const enviarMensaje = (mensaje) => pedir('/mensajes', { metodo: 'POST', cuerpo: mensaje });

/* ---------- Admin ---------- */
export const iniciarSesion = (correo, clave) =>
  pedir('/auth/login', { metodo: 'POST', cuerpo: { correo, clave } });

export const listarPedidos = () => pedir('/pedidos', { conAuth: true });
export const cambiarEstadoPedido = (id, estado) =>
  pedir(`/pedidos/${id}`, { metodo: 'PATCH', cuerpo: { estado }, conAuth: true });
export const eliminarPedido = (id) => pedir(`/pedidos/${id}`, { metodo: 'DELETE', conAuth: true });

export const listarMensajes = () => pedir('/mensajes', { conAuth: true });
export const marcarMensaje = (id, leido) =>
  pedir(`/mensajes/${id}`, { metodo: 'PATCH', cuerpo: { leido }, conAuth: true });
export const eliminarMensaje = (id) => pedir(`/mensajes/${id}`, { metodo: 'DELETE', conAuth: true });

export const listarTodosLosProductos = () => pedir('/productos/todos', { conAuth: true });
export const crearProducto = (producto) =>
  pedir('/productos', { metodo: 'POST', cuerpo: producto, conAuth: true });
export const actualizarProducto = (id, cambios) =>
  pedir(`/productos/${id}`, { metodo: 'PUT', cuerpo: cambios, conAuth: true });
export const eliminarProducto = (id) =>
  pedir(`/productos/${id}`, { metodo: 'DELETE', conAuth: true });
