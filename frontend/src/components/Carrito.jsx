import { useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { crearPedido } from '../api/client';
import { dinero } from '../hooks';

const NUMERO_WHATSAPP = '593978731507'; // +593 97 873 1507
const USUARIO_INSTAGRAM = 'encurtidosclassics1';

export default function Carrito() {
  const { lista, totalItems, totalMonto } = useCart();
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState('');
  const temporizador = useRef(null);

  const mostrarAviso = (texto) => {
    setAviso(texto);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso(''), 2600);
  };

  const vacio = lista.length === 0;

  const textoPedido = () => {
    let texto = "Hola 👋, quiero hacer un pedido en Encurtidos Classic's:\n\n";
    lista.forEach((i) => {
      texto += `• ${i.cantidad} x ${i.nombre} — ${dinero(i.cantidad * i.precio)}\n`;
    });
    texto += `\nTotal: ${dinero(totalMonto)}`;
    texto += '\n\n¿Me confirman disponibilidad y forma de entrega? ¡Gracias!';
    return texto;
  };

  // Guarda el pedido en MongoDB (a través de la API). Si falla, el cliente
  // igual puede enviar su pedido por WhatsApp/Instagram.
  const registrar = (metodoEnvio) => {
    crearPedido({
      metodoEnvio,
      productos: lista.map((i) => ({ nombre: i.nombre, cantidad: i.cantidad }))
    }).catch((error) => console.error('No se pudo registrar el pedido:', error));
  };

  const alEnviarWhatsapp = (e) => {
    if (vacio) {
      e.preventDefault();
      mostrarAviso('Agrega al menos un producto primero 🙂');
      return;
    }
    registrar('whatsapp');
  };

  const alEnviarInstagram = (e) => {
    if (vacio) {
      e.preventDefault();
      mostrarAviso('Agrega al menos un producto primero 🙂');
      return;
    }

    navigator.clipboard
      ?.writeText(textoPedido())
      .then(() => mostrarAviso('Pedido copiado. ¡Pégalo en el chat de Instagram! 📋'))
      .catch(() => mostrarAviso('Abriendo Instagram...'));

    registrar('instagram');
  };

  const hrefWhatsapp = vacio
    ? `https://wa.me/${NUMERO_WHATSAPP}`
    : `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(textoPedido())}`;

  return (
    <>
      <button className="cart-toggle" aria-label="Ver mi pedido" onClick={() => setAbierto((v) => !v)}>
        🛒
        <span className={`cart-count ${totalItems > 0 ? 'show' : ''}`}>{totalItems}</span>
      </button>

      <div className={`cart-panel ${abierto ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Tu pedido</h3>
          <button className="cart-close" aria-label="Cerrar pedido" onClick={() => setAbierto(false)}>
            ✕
          </button>
        </div>

        <div className="cart-items">
          {vacio ? (
            <p className="cart-empty">
              Aún no has agregado productos. Usa los botones + en cada producto.
            </p>
          ) : (
            lista.map((i) => (
              <div className="cart-item" key={i.nombre}>
                <span className="cart-item-name">{i.nombre}</span>
                <span className="cart-item-qty">x{i.cantidad}</span>
                <span className="cart-item-subtotal">{dinero(i.cantidad * i.precio)}</span>
              </div>
            ))
          )}
        </div>

        <div className="cart-total">
          <span>Total</span>
          <span>{dinero(totalMonto)}</span>
        </div>

        <div className="cart-actions">
          <a
            className={`cart-send cart-send-wa ${vacio ? 'disabled' : ''}`}
            href={hrefWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={alEnviarWhatsapp}
          >
            💬 Enviar por WhatsApp
          </a>
          <a
            className={`cart-send cart-send-ig ${vacio ? 'disabled' : ''}`}
            href={`https://ig.me/m/${USUARIO_INSTAGRAM}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={alEnviarInstagram}
          >
            📸 Enviar por Instagram
          </a>
        </div>

        <p className="cart-note">
          Al enviar por Instagram, el resumen del pedido se copia automáticamente: solo pégalo
          (Ctrl+V) en el chat.
        </p>
      </div>

      <div className={`cart-toast ${aviso ? 'show' : ''}`}>{aviso}</div>
    </>
  );
}
