import { useEffect, useRef } from 'react';

export const urlPublica = (archivo) => `${import.meta.env.BASE_URL}${archivo}`;

export const dinero = (valor) => `$${Number(valor).toFixed(2)}`;

/** Animación de aparición al hacer scroll (usa las clases .reveal de style.css) */
export function useReveal(dependencias = []) {
  const ref = useRef(null);

  useEffect(() => {
    const contenedor = ref.current;
    if (!contenedor) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('reveal-active');
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    contenedor.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
      observador.observe(el);
    });

    return () => observador.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  return ref;
}
