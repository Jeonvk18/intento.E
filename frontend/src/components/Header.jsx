import { useEffect, useState } from 'react';
import { urlPublica } from '../hooks';

const ENLACES = [
  ['inicio', 'Inicio'],
  ['nosotros', 'Nosotros'],
  ['productos', 'Productos'],
  ['beneficios', 'Beneficios'],
  ['historia', 'Historia'],
  ['faq', 'FAQ'],
  ['contacto', 'Contacto']
];

// Con HashRouter los enlaces "#seccion" chocarían con las rutas (#/admin),
// por eso navegamos a las secciones con scrollIntoView.
export function irASeccion(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [conScroll, setConScroll] = useState(false);

  useEffect(() => {
    const alHacerScroll = () => setConScroll(window.scrollY > 60);
    alHacerScroll();
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    return () => window.removeEventListener('scroll', alHacerScroll);
  }, []);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => e.isIntersecting && setSeccionActiva(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    ENLACES.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, []);

  const navegar = (evento, id) => {
    evento.preventDefault();
    setMenuAbierto(false);
    irASeccion(id);
  };

  return (
    <header className={conScroll ? 'scrolled' : ''}>
      <div className="overlay">
        <nav>
          <div className="logo">
            <span>ENCURTIDOS CLASSIC'S</span>
          </div>

          <ul id="nav-links" className={menuAbierto ? 'open' : ''}>
            {ENLACES.map(([id, texto]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={seccionActiva === id ? 'active-link' : ''}
                  onClick={(e) => navegar(e, id)}
                >
                  {texto}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={`nav-toggle ${menuAbierto ? 'active' : ''}`}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            aria-controls="nav-links"
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        <div className="hero" id="inicio">
          <div className="hero-text">
            <h1>
              El auténtico sabor de los <span>encurtidos artesanales.</span>
            </h1>

            <p>
              Elaborados con ingredientes frescos, seleccionados cuidadosamente y preparados de forma
              artesanal para acompañar tus comidas favoritas.
            </p>

            <a href="#productos" className="btn" onClick={(e) => navegar(e, 'productos')}>
              Ver Productos
            </a>

            <a href="https://jeonvk18.github.io/recetario/" className="btn btn-recetario">
              Ver Recetario
            </a>
          </div>

          <div className="hero-image">
            <img src={urlPublica('img5.webp')} width="500" height="500" alt="Encurtidos" />
          </div>
        </div>
      </div>
    </header>
  );
}
