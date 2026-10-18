import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { iniciarSesion, guardarToken } from '../api/client';

export default function AdminLogin() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navegar = useNavigate();

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const { token } = await iniciarSesion(correo, clave);
      guardarToken(token);
      navegar('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="admin-login">
      <form className="admin-card" onSubmit={enviar}>
        <h1>🥒 Panel de administración</h1>
        <p>Solo para el equipo de Encurtidos Classic's.</p>

        <label>
          Correo
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </label>

        <label>
          Contraseña
          <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </label>

        {error && <p className="form-estado form-error">{error}</p>}

        <button className="btn" type="submit" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>

        <Link to="/" className="admin-volver">
          ← Volver a la tienda
        </Link>
      </form>
    </main>
  );
}
