import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  obtenerToken,
  borrarToken,
  listarPedidos,
  cambiarEstadoPedido,
  eliminarPedido,
  listarMensajes,
  marcarMensaje,
  eliminarMensaje,
  listarTodosLosProductos,
  actualizarProducto
} from '../api/client';
import { dinero } from '../hooks';

const fecha = (iso) =>
  new Date(iso).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' });

/* ---------------- Pedidos ---------------- */
function TablaPedidos({ pedidos, alCambiar }) {
  const cambiar = async (id, estado) => {
    await cambiarEstadoPedido(id, estado);
    alCambiar();
  };

  const borrar = async (id) => {
    if (!window.confirm('¿Eliminar este pedido?')) return;
    await eliminarPedido(id);
    alCambiar();
  };

  if (!pedidos.length) return <p className="admin-vacio">Aún no hay pedidos.</p>;

  return (
    <div className="admin-tabla-wrap">
      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Canal</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p._id}>
              <td>{fecha(p.createdAt)}</td>
              <td>
                {p.productos.map((i) => (
                  <div key={i.nombre}>
                    {i.cantidad} × {i.nombre}
                  </div>
                ))}
              </td>
              <td>{dinero(p.total)}</td>
              <td>{p.metodoEnvio}</td>
              <td>
                <select value={p.estado} onChange={(e) => cambiar(p._id, e.target.value)}>
                  <option value="nuevo">Nuevo</option>
                  <option value="atendido">Atendido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </td>
              <td>
                <button className="admin-borrar" onClick={() => borrar(p._id)} aria-label="Eliminar pedido">
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Mensajes ---------------- */
function ListaMensajes({ mensajes, alCambiar }) {
  const alternar = async (m) => {
    await marcarMensaje(m._id, !m.leido);
    alCambiar();
  };

  const borrar = async (id) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    await eliminarMensaje(id);
    alCambiar();
  };

  if (!mensajes.length) return <p className="admin-vacio">Aún no hay mensajes.</p>;

  return (
    <div className="admin-mensajes">
      {mensajes.map((m) => (
        <article key={m._id} className={`admin-mensaje ${m.leido ? 'leido' : ''}`}>
          <header>
            <strong>{m.nombre}</strong>
            <a href={`mailto:${m.correo}`}>{m.correo}</a>
            <time>{fecha(m.createdAt)}</time>
          </header>
          {/* React escapa el texto: el contenido del cliente nunca se ejecuta como HTML */}
          <p>{m.mensaje}</p>
          <div className="admin-acciones">
            <button onClick={() => alternar(m)}>{m.leido ? 'Marcar como nuevo' : 'Marcar como leído'}</button>
            <button className="admin-borrar" onClick={() => borrar(m._id)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---------------- Productos ---------------- */
function TablaProductos({ productos, alCambiar }) {
  const guardarPrecio = async (producto, valor) => {
    const precio = parseFloat(valor);
    if (Number.isNaN(precio) || precio < 0 || precio === producto.precio) return;
    await actualizarProducto(producto._id, { precio });
    alCambiar();
  };

  const alternarActivo = async (producto) => {
    await actualizarProducto(producto._id, { activo: !producto.activo });
    alCambiar();
  };

  return (
    <div className="admin-tabla-wrap">
      <table className="admin-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio (USD)</th>
            <th>Visible en la tienda</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p._id}>
              <td>{p.nombre}</td>
              <td>
                <input
                  className="admin-precio"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={p.precio.toFixed(2)}
                  onBlur={(e) => guardarPrecio(p, e.target.value)}
                />
              </td>
              <td>
                <input type="checkbox" checked={p.activo} onChange={() => alternarActivo(p)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Panel ---------------- */
export default function AdminPanel() {
  const [pestana, setPestana] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const navegar = useNavigate();

  const salir = useCallback(() => {
    borrarToken();
    navegar('/admin/login');
  }, [navegar]);

  const cargar = useCallback(async () => {
    try {
      const [ped, msj, prod] = await Promise.all([
        listarPedidos(),
        listarMensajes(),
        listarTodosLosProductos()
      ]);
      setPedidos(ped);
      setMensajes(msj);
      setProductos(prod);
      setError('');
    } catch (err) {
      if (err.estado === 401) salir(); // token vencido o inválido
      else setError(err.message);
    }
  }, [salir]);

  useEffect(() => {
    if (obtenerToken()) cargar();
  }, [cargar]);

  if (!obtenerToken()) return <Navigate to="/admin/login" replace />;

  const nuevosPedidos = pedidos.filter((p) => p.estado === 'nuevo').length;
  const mensajesSinLeer = mensajes.filter((m) => !m.leido).length;
  const ventas = pedidos
    .filter((p) => p.estado !== 'cancelado')
    .reduce((suma, p) => suma + p.total, 0);

  return (
    <main className="admin-panel">
      <header className="admin-barra">
        <h1>🥒 Panel Encurtidos Classic's</h1>
        <div>
          <Link to="/">Ver tienda</Link>
          <button onClick={salir}>Cerrar sesión</button>
        </div>
      </header>

      <section className="admin-resumen">
        <div>
          <strong>{nuevosPedidos}</strong>
          <span>Pedidos nuevos</span>
        </div>
        <div>
          <strong>{mensajesSinLeer}</strong>
          <span>Mensajes sin leer</span>
        </div>
        <div>
          <strong>{dinero(ventas)}</strong>
          <span>Total pedidos (sin cancelados)</span>
        </div>
      </section>

      <nav className="admin-pestanas">
        {[
          ['pedidos', `Pedidos (${pedidos.length})`],
          ['mensajes', `Mensajes (${mensajes.length})`],
          ['productos', `Productos (${productos.length})`]
        ].map(([id, texto]) => (
          <button key={id} className={pestana === id ? 'activa' : ''} onClick={() => setPestana(id)}>
            {texto}
          </button>
        ))}
      </nav>

      {error && <p className="form-estado form-error">{error}</p>}

      {pestana === 'pedidos' && <TablaPedidos pedidos={pedidos} alCambiar={cargar} />}
      {pestana === 'mensajes' && <ListaMensajes mensajes={mensajes} alCambiar={cargar} />}
      {pestana === 'productos' && <TablaProductos productos={productos} alCambiar={cargar} />}
    </main>
  );
}
