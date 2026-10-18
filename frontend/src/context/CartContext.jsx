import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // { [nombre]: { precio, cantidad } }
  const [items, setItems] = useState({});

  const agregar = (producto) =>
    setItems((actual) => ({
      ...actual,
      [producto.nombre]: {
        precio: producto.precio,
        cantidad: (actual[producto.nombre]?.cantidad || 0) + 1
      }
    }));

  const quitar = (nombre) =>
    setItems((actual) => {
      const item = actual[nombre];
      if (!item) return actual;
      const copia = { ...actual };
      if (item.cantidad <= 1) delete copia[nombre];
      else copia[nombre] = { ...item, cantidad: item.cantidad - 1 };
      return copia;
    });

  const vaciar = () => setItems({});

  const valor = useMemo(() => {
    const lista = Object.entries(items).map(([nombre, d]) => ({ nombre, ...d }));
    return {
      items,
      lista,
      totalItems: lista.reduce((s, i) => s + i.cantidad, 0),
      totalMonto: lista.reduce((s, i) => s + i.cantidad * i.precio, 0),
      cantidadDe: (nombre) => items[nombre]?.cantidad || 0,
      agregar,
      quitar,
      vaciar
    };
  }, [items]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return contexto;
};
