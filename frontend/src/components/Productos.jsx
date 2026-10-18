import { useEffect, useState } from 'react';
import { listarProductos } from '../api/client';
import { useCart } from '../context/CartContext';
import { useReveal, urlPublica, dinero } from '../hooks';

function Stepper({ producto, extraClase = '' }) {
  const { cantidadDe, agregar, quitar } = useCart();

  return (
    <div className={`qty-stepper ${extraClase}`}>
      <button className="qty-btn qty-minus" aria-label="Quitar uno" onClick={() => quitar(producto.nombre)}>
        −
      </button>
      <span className="qty-value">{cantidadDe(producto.nombre)}</span>
      <button className="qty-btn qty-plus" aria-label="Agregar uno" onClick={() => agregar(producto)}>
        +
      </button>
    </div>
  );
}

function TarjetaProducto({ producto }) {
  return (
    <div className="producto reveal">
      <img src={urlPublica(producto.imagen)} alt={producto.alt || producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <span>{dinero(producto.precio)}</span>
      <Stepper producto={producto} />
    </div>
  );
}

function ProductoTemporada({ producto }) {
  return (
    <section className="mango-producto reveal" id="mango">
      <div className="mango-contenedor">
        <div className="mango-imagen">
          <img src={urlPublica(producto.imagen)} alt={producto.alt || producto.nombre} />
          <span className="mango-badge">⏳ POR TEMPORADAS</span>
        </div>

        <div className="mango-info">
          <span className="mango-etiqueta">🥭 PRODUCTO ESTRELLA</span>
          <h2>{producto.nombre}</h2>
          <h3>¡Uno de nuestros sabores más esperados!</h3>
          <p>{producto.descripcion}</p>

          <div className="mango-aviso">
            <span>🥭</span>
            <div>
              <strong>Edición especial</strong>
              <p>Disponible por temporadas.</p>
            </div>
          </div>

          <Stepper producto={producto} extraClase="qty-stepper-mango" />

          <a
            href="https://www.instagram.com/encurtidosclassics1"
            target="_blank"
            rel="noopener noreferrer"
            className="mango-btn"
          >
            📱 Pídelo por Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | error

  useEffect(() => {
    listarProductos()
      .then((datos) => {
        setProductos(datos);
        setEstado('listo');
      })
      .catch(() => setEstado('error'));
  }, []);

  const ref = useReveal([productos]);
  const normales = productos.filter((p) => !p.temporada);
  const temporada = productos.filter((p) => p.temporada);

  return (
    <section className="container" id="productos" ref={ref}>
      <div className="title">
        <h2>Nuestros Productos</h2>
        <p>
          Elaborados con ingredientes naturales, perfectos para acompañar hamburguesas, hot dogs,
          ensaladas y mucho más.
        </p>
      </div>

      {estado === 'cargando' && <p style={{ textAlign: 'center' }}>Cargando productos…</p>}

      {estado === 'error' && (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          No se pudieron cargar los productos. Intenta recargar la página.
        </p>
      )}

      {estado === 'listo' && (
        <>
          <div className="productos">
            {normales.map((p) => (
              <TarjetaProducto key={p._id} producto={p} />
            ))}
          </div>

          {temporada.map((p) => (
            <ProductoTemporada key={p._id} producto={p} />
          ))}

          <table className="reveal">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Presentación</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td>{p.nombre.replace('Encurtido de ', '')}</td>
                  <td>{p.presentacion}</td>
                  <td>{dinero(p.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
