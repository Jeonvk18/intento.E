import { useReveal, urlPublica } from '../hooks';

/* Secciones informativas (sin datos del servidor) */

export function Nosotros() {
  const ref = useReveal();

  return (
    <section className="container" id="nosotros" ref={ref}>
      <div className="title">
        <h2>¿Quiénes Somos?</h2>
        <p>Una marca apasionada por ofrecer productos naturales con el auténtico sabor casero.</p>
      </div>

      <div className="cards">
        <div className="card reveal">
          <h3>🌿 Ingredientes Frescos</h3>
          <p>
            Utilizamos vegetales cuidadosamente seleccionados para garantizar calidad y frescura.
          </p>
        </div>
        <div className="card reveal">
          <h3>🥒 Elaboración Artesanal</h3>
          <p>
            Cada frasco es preparado siguiendo recetas tradicionales que conservan el verdadero sabor
            casero.
          </p>
        </div>
        <div className="card reveal">
          <h3>⭐ Calidad Garantizada</h3>
          <p>
            Sin conservantes industriales y con procesos que mantienen la textura y el sabor natural.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Beneficios() {
  const ref = useReveal();

  return (
    <section className="container" id="beneficios" ref={ref}>
      <div className="title">
        <h2>¿Por qué elegir Encurtidos Classic's?</h2>
        <p>
          Nos esforzamos por ofrecer un producto de calidad, elaborado con ingredientes naturales y
          mucho cuidado.
        </p>
      </div>

      <div className="cards">
        <div className="card reveal">
          <h3>🌱 100% Naturales</h3>
          <p>Utilizamos vegetales frescos y seleccionados para conservar su sabor y textura.</p>
        </div>
        <div className="card reveal">
          <h3>🥗 Acompañan Todo</h3>
          <p>Perfectos para hamburguesas, hot dogs, ensaladas, carnes y muchas recetas más.</p>
        </div>
        <div className="card reveal">
          <h3>🏡 Sabor Casero</h3>
          <p>Elaborados con recetas tradicionales que mantienen el auténtico sabor artesanal.</p>
        </div>
        <div className="card reveal">
          <h3>⭐ Calidad Garantizada</h3>
          <p>Cada frasco pasa por un proceso cuidadoso para ofrecer la mejor experiencia.</p>
        </div>
      </div>
    </section>
  );
}

export function Historia() {
  const ref = useReveal();

  return (
    <section className="container" id="historia" ref={ref}>
      <div className="title">
        <h2>Nuestra Historia</h2>
        <p>Todo gran proyecto comienza con una idea y mucha pasión.</p>
      </div>

      <div className="historia">
        <div className="historia-texto reveal">
          <h3>¿Cómo nació Encurtidos Classic's?</h3>

          <p>
            Encurtidos Classic's nació con el propósito de compartir el auténtico sabor de los
            encurtidos artesanales elaborados con ingredientes frescos y recetas tradicionales. Desde
            el inicio, nuestro objetivo ha sido ofrecer un producto de calidad que combine tradición,
            frescura y practicidad, permitiendo que cualquier persona disfrute de un alimento natural
            en sus comidas, reuniones o como un complemento delicioso para diferentes recetas.
          </p>

          <p>
            Lo que comenzó como una preparación casera para familiares y amigos, poco a poco se
            convirtió en un emprendimiento dedicado a ofrecer productos de alta calidad, conservando
            siempre el sabor natural y el cariño en cada frasco.
          </p>

          <p>
            A diferencia de muchas marcas del mercado nacional, nuestros productos no contienen
            aditivos ni conservantes industriales, ya que utilizamos métodos de conservación
            naturales mediante limón y vinagre, cuyos ácidos ayudan a mantener los nutrientes,
            aportar propiedades antioxidantes y favorecer la salud digestiva.
          </p>

          <p>
            Hoy seguimos trabajando con el mismo compromiso: llevar a cada hogar un producto fresco,
            artesanal y perfecto para acompañar cualquier comida.
          </p>
        </div>

        <div className="historia-video reveal">
          <video autoPlay muted loop playsInline preload="none" poster={urlPublica('img6.jpeg')}>
            <source src={urlPublica('vid1.mp4')} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        </div>
      </div>
    </section>
  );
}

const PREGUNTAS = [
  [
    '🥒 ¿Los encurtidos son 100% naturales?',
    'Sí. Nuestros productos son elaborados con ingredientes frescos y sin conservantes industriales.'
  ],
  ['📦 ¿Cuál es la presentación disponible?', 'Actualmente contamos con frascos de 110 y 120 gramos.'],
  ['🚚 ¿Realizan envíos?', 'Sí, realizamos entregas según la ubicación del cliente.'],
  ['📸 ¿Dónde puedo hacer un pedido?', 'Puedes hacerlo desde el carrito de esta página o escribirnos por Instagram.']
];

export function Faq() {
  const ref = useReveal();

  return (
    <section className="container" id="faq" ref={ref}>
      <div className="title">
        <h2>Preguntas Frecuentes</h2>
        <p>Resolvemos las dudas más comunes de nuestros clientes.</p>
      </div>

      {PREGUNTAS.map(([pregunta, respuesta]) => (
        <details key={pregunta} className="reveal">
          <summary>{pregunta}</summary>
          <p>{respuesta}</p>
        </details>
      ))}
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <h2>🥒 Encurtidos Classic's</h2>
        <p>El sabor casero que combina con todo.</p>
        <hr />
        <p>
          © 2026 Encurtidos Classic's
          <br />
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
