import { useState } from 'react';
import { enviarMensaje } from '../api/client';
import { useReveal } from '../hooks';

const VACIO = { nombre: '', correo: '', mensaje: '' };

export default function Contacto() {
  const [datos, setDatos] = useState(VACIO);
  const [estado, setEstado] = useState({ tipo: 'inactivo', texto: '' });
  const ref = useReveal();

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setEstado({ tipo: 'enviando', texto: 'Enviando…' });

    try {
      await enviarMensaje(datos);
      setDatos(VACIO);
      setEstado({ tipo: 'ok', texto: '¡Gracias! Recibimos tu mensaje y te responderemos pronto. 💚' });
    } catch (error) {
      setEstado({ tipo: 'error', texto: error.message });
    }
  };

  return (
    <section className="container contacto" id="contacto" ref={ref}>
      <div className="title">
        <h2>Contáctanos</h2>
        <p>
          Escríbenos o síguenos en nuestras redes sociales para descubrir nuevos productos,
          promociones y recetas.
        </p>
      </div>

      <div className="contact-box">
        <div className="info reveal">
          <h3>📍 Ubicación</h3>
          <p>Guayaquil, Ecuador</p>
          <h3>📱 Atención</h3>
          <p>Lunes a Sábado</p>
          <p>08:00 - 18:00</p>
        </div>

        <div className="social reveal">
          <h3>Instagram</h3>
          <p>@encurtidosclassics1</p>
          <a
            href="https://www.instagram.com/encurtidosclassics1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Visitar Instagram 📸
          </a>
        </div>
      </div>

      <form className="form-contacto reveal" onSubmit={enviar}>
        <h3>✉️ Envíanos un mensaje</h3>

        <label>
          Nombre
          <input name="nombre" value={datos.nombre} onChange={cambiar} maxLength={80} required />
        </label>

        <label>
          Correo
          <input
            name="correo"
            type="email"
            value={datos.correo}
            onChange={cambiar}
            maxLength={120}
            required
          />
        </label>

        <label>
          Mensaje
          <textarea
            name="mensaje"
            rows={4}
            value={datos.mensaje}
            onChange={cambiar}
            maxLength={1000}
            required
          />
        </label>

        <button className="btn" type="submit" disabled={estado.tipo === 'enviando'}>
          {estado.tipo === 'enviando' ? 'Enviando…' : 'Enviar mensaje'}
        </button>

        {estado.texto && estado.tipo !== 'enviando' && (
          <p className={`form-estado form-${estado.tipo}`} role="status">
            {estado.texto}
          </p>
        )}
      </form>
    </section>
  );
}
