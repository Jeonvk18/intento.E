# 🥒 Encurtidos Classic's

Emprendimiento digital full stack: tienda web con catálogo, carrito de pedidos, formulario de contacto, panel de administración con login y chatbot.

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + React Router (HashRouter) |
| Backend | Node.js + Express |
| Base de datos | MongoDB Atlas + Mongoose |
| Autenticación | JWT + bcrypt (solo el administrador) |
| Publicación | Frontend en GitHub Pages · API en Render |

## Estructura

```
encurtidos-app/
├── backend/
│   └── src/
│       ├── config/db.js          conexión a MongoDB
│       ├── models/               Product, Order, Message, Admin
│       ├── routes/               auth, products, orders, messages
│       ├── middleware/auth.js    verifica el token JWT
│       ├── seed.js               carga productos y crea el admin
│       └── server.js             arranque de Express
└── frontend/
    └── src/
        ├── api/client.js         todas las llamadas a la API
        ├── context/CartContext   estado del carrito
        ├── components/           Header, Productos, Carrito, Contacto...
        └── pages/                Home, AdminLogin, AdminPanel
```

## API

| Método | Ruta | Acceso | Qué hace |
|---|---|---|---|
| GET | `/api/productos` | Público | Catálogo activo |
| POST | `/api/pedidos` | Público | Registra un pedido (el servidor recalcula precios y total) |
| POST | `/api/mensajes` | Público | Guarda un mensaje del formulario de contacto |
| POST | `/api/auth/login` | Público | Devuelve un token si las credenciales son correctas |
| GET/PATCH/DELETE | `/api/pedidos` | Admin | Ver, cambiar estado y borrar pedidos |
| GET/PATCH/DELETE | `/api/mensajes` | Admin | Ver, marcar leído y borrar mensajes |
| GET/POST/PUT/DELETE | `/api/productos...` | Admin | Gestionar el catálogo |

## 1. Crear la base de datos en MongoDB Atlas

1. Crea una cuenta en <https://www.mongodb.com/cloud/atlas> y un clúster gratuito (M0).
2. **Database Access** → crea un usuario con contraseña (anótalos).
3. **Network Access** → agrega `0.0.0.0/0` (necesario para que Render pueda conectarse).
4. **Database → Connect → Drivers** → copia la cadena de conexión y cambia `<password>` por tu contraseña. Añade el nombre de la base antes del `?`:
   `mongodb+srv://USUARIO:CLAVE@cluster0.xxxxx.mongodb.net/encurtidos?retryWrites=true&w=majority`

## 2. Ejecutar en tu computador

```bash
# Backend
cd backend
cp .env.example .env        # completa MONGODB_URI, JWT_SECRET, ADMIN_EMAIL y ADMIN_PASSWORD
npm install
npm run seed                # crea productos y el usuario administrador
npm run dev                 # http://localhost:4000

# Frontend (otra terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:5173
```

- Tienda: <http://localhost:5173/encurtidos-classics/>
- Panel admin: <http://localhost:5173/encurtidos-classics/#/admin>

## 3. Publicar

**GitHub Pages no ejecuta Node.js**, así que el proyecto se publica en dos partes:

**API en Render (gratis)**
1. <https://render.com> → *New → Web Service* → conecta este repositorio.
2. Root Directory: `backend` · Build: `npm install` · Start: `npm start`.
3. En *Environment* agrega: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGINS=https://jeonvk18.github.io`.
4. Cuando termine, copia la URL (por ejemplo `https://encurtidos-api.onrender.com`).
5. Ejecuta `npm run seed` una vez, desde tu computador con el `.env` apuntando a Atlas.

> El plan gratuito de Render se "duerme" tras unos minutos sin uso; la primera visita puede tardar ~30 s.

**Frontend en GitHub Pages**
1. Repositorio → *Settings → Pages* → Source: **GitHub Actions**.
2. *Settings → Secrets and variables → Actions → Variables* → crea `VITE_API_URL` con `https://TU-API.onrender.com/api`.
3. Haz push a `main`: el workflow `.github/workflows/deploy-frontend.yml` compila y publica.
4. Si cambias el nombre del repositorio, actualiza `base` en `frontend/vite.config.js` y las rutas de los íconos en `frontend/index.html`.

## Migración desde Firebase

- La colección `pedidos` de Firestore ahora es la colección `orders` de MongoDB. El historial anterior **no se copia solo**: si quieres conservarlo, exporta desde la consola de Firebase y avísame para armar un script de importación.
- Se eliminaron `pedidos-db.js` y los scripts de Firebase. Una vez comprobado que todo funciona, puedes borrar el proyecto en la consola de Firebase.
- Los productos pasaron de `productos.json` a la colección `products` (el Mango ahora también vive allí). Se administran desde el panel.

## Seguridad

- Nunca subas `backend/.env` a GitHub (ya está en `.gitignore`).
- Si pegaste tu cadena de MongoDB en un chat o repositorio por error, cambia la contraseña del usuario en Atlas.
- Las rutas de administración exigen token; el login tiene límite de intentos y las contraseñas se guardan con bcrypt.
- Los pedidos se recalculan en el servidor con los precios de la base de datos.
