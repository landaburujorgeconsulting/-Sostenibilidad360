# 🌿 Sostenibilidad 360°
**Jorge Luis Landaburu**

Plataforma web de sostenibilidad con Firebase — datos persistentes, login de administrador, subida real de archivos y diseño responsive.

---

## ✨ Funcionalidades

- 📰 Feed de noticias con imagen, categoría y filtros
- 📎 Archivos descargables (PDF, Word, Excel, PPT)
- 🖼️ Galería de fotos
- ✍️ Editoriales de la comunidad
- 💬 Comentarios en cada publicación
- 👍 Likes
- 🔐 Login de administrador (solo vos podés borrar contenido)
- ☁️ Datos guardados en Firebase (persisten aunque se cierre la página)

---

## 🚀 Cómo configurar Firebase (OBLIGATORIO antes de usar)

### Paso 1 — Crear proyecto Firebase

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Hacer clic en **"Agregar proyecto"**
3. Ponerle un nombre (ej: `sostenibilidad360`) y crearlo

### Paso 2 — Activar Firestore (base de datos)

1. En el menú izquierdo: **Build → Firestore Database**
2. Clic en **"Crear base de datos"**
3. Elegir **"Iniciar en modo de prueba"** → Siguiente → Listo

### Paso 3 — Activar Storage (archivos y fotos)

1. En el menú izquierdo: **Build → Storage**
2. Clic en **"Comenzar"**
3. Elegir **"Iniciar en modo de prueba"** → Listo

### Paso 4 — Activar Authentication (login admin)

1. En el menú izquierdo: **Build → Authentication**
2. Clic en **"Comenzar"**
3. Ir a la pestaña **"Sign-in method"**
4. Activar **"Correo electrónico/contraseña"**
5. Ir a la pestaña **"Users"** → **"Agregar usuario"**
6. Ingresar tu email y contraseña de administrador → Guardar

### Paso 5 — Obtener la configuración

1. En la página principal del proyecto, hacer clic en el ícono **`</>`** (Web)
2. Registrar la app con cualquier nombre
3. Firebase te va a mostrar un objeto `firebaseConfig` con estos datos:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### Paso 6 — Pegar la config en app.js

Abrir `app.js` y reemplazar los valores en la sección marcada con `⚙️ CONFIGURACIÓN FIREBASE`:

```js
const firebaseConfig = {
  apiKey:            "TU_API_KEY",        // ← reemplazá
  authDomain:        "TU_PROJECT...",     // ← reemplazá
  projectId:         "TU_PROJECT_ID",     // ← reemplazá
  storageBucket:     "TU_PROJECT...",     // ← reemplazá
  messagingSenderId: "TU_SENDER_ID",      // ← reemplazá
  appId:             "TU_APP_ID"          // ← reemplazá
};
```

### Paso 7 — Configurar reglas de seguridad (importante)

En Firebase Console → **Firestore → Reglas**, reemplazar con esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if true;
      allow delete: if request.auth != null;
    }
  }
}
```

En Firebase Console → **Storage → Reglas**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if true;
      allow delete: if request.auth != null;
    }
  }
}
```

---

## 📁 Estructura del proyecto

```
sostenibilidad360/
├── index.html   # Estructura HTML
├── style.css    # Estilos
├── app.js       # Lógica + Firebase
└── README.md    # Este archivo
```

---

## 🌐 Deploy en Render (Static Site)

1. Subir los 4 archivos a GitHub
2. En Render crear un **Static Site**
3. Conectar el repositorio
4. **Publish directory:** `./`
5. Deploy → listo

---

## 📬 Contacto

**Jorge Luis Landaburu**  
Consultoría en huella de carbono y reportes de sostenibilidad  
GRI Standards · GHG Protocol · CSRD/ESRS · ODS 2030
