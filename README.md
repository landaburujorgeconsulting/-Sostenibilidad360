# 🌿 Sostenibilidad 360°

**Plataforma web de sostenibilidad** desarrollada por **Jorge Luis Landaburu**.  
Un espacio para compartir actualizaciones, documentos, fotos y editoriales sobre cambio climático, ESG y desarrollo sostenible.

---

## 📋 Descripción

Sostenibilidad 360° es un sitio web estático pensado para construir comunidad alrededor de los temas más relevantes de la agenda sostenible: GRI Standards, GHG Protocol, ODS 2030, CSRD/ESRS y más. Cualquier visitante puede leer el contenido, dejar comentarios y publicar sus propias notas o editoriales.

---

## ✨ Funcionalidades

- 📰 **Feed de noticias** — publicación de actualizaciones con imagen de portada, categoría y autor
- 📎 **Documentos** — carga y listado de archivos PDF, Word, Excel, PPT
- 🖼️ **Galería de fotos** — subida y visualización de imágenes
- ✍️ **Editoriales** — espacio abierto para que la comunidad publique opiniones y análisis
- 💬 **Comentarios** — los lectores pueden opinar en cada publicación
- 👍 **Likes** — reacciones en notas y editoriales
- 🔍 **Filtros por categoría** — Clima, ESG/GRI, ODS, Empresas
- 📊 **Estadísticas en tiempo real** en el sidebar

---

## 🗂️ Estructura del proyecto

```
sostenibilidad360/
├── index.html    # Estructura HTML de la página
├── style.css     # Todos los estilos (colores, layout, componentes)
├── app.js        # Lógica JavaScript (render, publicaciones, comentarios)
└── README.md     # Este archivo
```

---

## 🚀 Cómo publicar en GitHub Pages

1. Crear un repositorio nuevo en [github.com](https://github.com)
2. Subir los 4 archivos (`index.html`, `style.css`, `app.js`, `README.md`) a la rama `main`
3. Ir a **Settings → Pages → Source → Deploy from branch → main / root**
4. En unos minutos el sitio estará disponible en:

```
https://tuusuario.github.io/nombre-del-repo
```

---

## 🌐 Cómo conectar un dominio .com propio

1. Comprar el dominio en [Namecheap](https://www.namecheap.com) o [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (~u$s 12/año)
2. En el repositorio de GitHub, ir a **Settings → Pages → Custom domain** e ingresar el dominio
3. En el registrador del dominio, crear los siguientes registros DNS:

| Tipo  | Nombre | Valor                  |
|-------|--------|------------------------|
| A     | @      | 185.199.108.153        |
| A     | @      | 185.199.109.153        |
| A     | @      | 185.199.110.153        |
| A     | @      | 185.199.111.153        |
| CNAME | www    | tuusuario.github.io    |

4. Esperar entre 24 y 48 horas para que los DNS se propaguen
5. Activar **Enforce HTTPS** en la configuración de GitHub Pages

---

## 🛠️ Tecnologías utilizadas

- HTML5 semántico
- CSS3 con variables personalizadas
- JavaScript vanilla (sin frameworks ni dependencias)
- Google Fonts: Playfair Display + DM Sans

---

## 📌 Notas

- El sitio es completamente estático: no requiere servidor ni base de datos
- El contenido publicado se guarda en memoria durante la sesión del navegador; al recargar la página se reinicia al contenido de ejemplo
- Para persistencia real de datos se requeriría integrar un backend o servicio como Firebase

---

## 📬 Contacto

**Jorge Luis Landaburu**  
Consultoría en huella de carbono y reportes de sostenibilidad  
Marcos ESG: GRI Standards · GHG Protocol · CSRD/ESRS · ODS 2030
