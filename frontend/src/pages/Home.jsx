import Header from '../components/Header';
import { Nosotros, Beneficios, Historia, Faq, Footer } from '../components/Secciones';
import Productos from '../components/Productos';
import Contacto from '../components/Contacto';
import Carrito from '../components/Carrito';
import Flotantes from '../components/Flotantes';
import Chatbot from '../components/Chatbot';

export default function Home() {
  return (
    <>
      <Header />
      <Nosotros />
      <Productos />
      <Beneficios />
      <Historia />
      <Faq />
      <Contacto />
      <Footer />
      <Carrito />
      <Flotantes />
      <Chatbot />
    </>
  );
}
