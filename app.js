/* ============================================================
   SOSTENIBILIDAD 360° — app.js
   Jorge Luis Landaburu
   ============================================================ */

const CATEGORIES = { clima: 'verde', esg: 'azul', ods: 'tierra', empresa: 'acento', otros: 'tierra' };
const CAT_LABELS  = { clima: 'Clima', esg: 'ESG / GRI', ods: 'ODS', empresa: 'Empresas', otros: 'Otros' };
const CAT_ICONS   = { clima: '🌍', esg: '📊', ods: '🎯', empresa: '🏢', otros: '📌' };

/* ============================================================
   DATOS INICIALES
   ============================================================ */

let data = {
  feed: [
    {
      id: 1,
      tipo: 'noticia',
      titulo: 'Argentina avanza en reporte CSRD para multinacionales',
      autor: 'Jorge Luis Landaburu',
      fecha: '28/04/2026',
      categoria: 'esg',
      contenido: 'Las empresas con operaciones en la Unión Europea deberán adaptarse a los estándares ESRS antes del 2025. En Argentina, las principales empresas cotizantes ya están trabajando en sus primeras memorias de sostenibilidad alineadas con CSRD. El proceso implica una revisión profunda de la doble materialidad, incluyendo impactos financieros y sobre el medio ambiente y la sociedad. La Comisión Nacional de Valores analiza requerimientos de divulgación ESG para el mercado local.',
      img: null,
      likes: 12,
      comentarios: [
        { autor: 'M. García', texto: 'Muy importante para la competitividad exportadora.' },
        { autor: 'L. Roldán', texto: '¿Sabés si habrá guías para PyMES?' }
      ]
    },
    {
      id: 2,
      tipo: 'noticia',
      titulo: 'Nuevo Informe IPCC: el tiempo para actuar se acorta',
      autor: 'Jorge Luis Landaburu',
      fecha: '25/04/2026',
      categoria: 'clima',
      contenido: 'El Panel Intergubernamental sobre el Cambio Climático publicó su último informe de síntesis, con conclusiones más urgentes que nunca. Las temperaturas globales superaron ya 1.1°C sobre los niveles preindustriales y, de mantenerse las emisiones actuales, se alcanzarían 1.5°C antes de 2035. Los sectores más vulnerables incluyen la agricultura, el agua y los sistemas costeros. América del Sur aparece como una región crítica por la pérdida de glaciares andinos y la amenaza a la Amazonia.',
      img: null,
      likes: 27,
      comentarios: [
        { autor: 'R. Méndez', texto: 'Este informe es fundamental. Gracias por compartirlo.' }
      ]
    },
    {
      id: 3,
      tipo: 'noticia',
      titulo: 'ODS: Balance a mitad del camino hacia 2030',
      autor: 'Jorge Luis Landaburu',
      fecha: '20/04/2026',
      categoria: 'ods',
      contenido: 'A cinco años del cierre de la Agenda 2030, Naciones Unidas presentó un informe devastador: solo el 15% de los Objetivos de Desarrollo Sostenible están en curso para cumplirse. El ODS 13 (Acción por el Clima) y el ODS 1 (Fin de la Pobreza) acumulan los mayores retrasos. La región latinoamericana muestra un desempeño mixto, con avances en educación pero retrocesos en desigualdad. Se requieren inversiones masivas y un cambio de paradigma en las políticas públicas.',
      img: null,
      likes: 9,
      comentarios: []
    }
  ],
  archivos: [
    {
      id: 1,
      nombre: 'GRI Standards 2021 — Guía completa.pdf',
      tipo: 'pdf',
      autor: 'Jorge Luis Landaburu',
      fecha: '15/04/2026',
      size: '4.2 MB',
      desc: 'Compilado de todos los estándares GRI 2021 con notas de aplicación.'
    },
    {
      id: 2,
      nombre: 'Inventario GHG — Plantilla Alcances 1 2 3.xlsx',
      tipo: 'xlsx',
      autor: 'Jorge Luis Landaburu',
      fecha: '10/04/2026',
      size: '890 KB',
      desc: 'Plantilla Excel para cálculo de huella de carbono por alcances.'
    },
    {
      id: 3,
      nombre: 'ESRS — Resumen ejecutivo para PyMES.pdf',
      tipo: 'pdf',
      autor: 'Jorge Luis Landaburu',
      fecha: '5/04/2026',
      size: '1.8 MB',
      desc: 'Simplificación de los estándares ESRS enfocada en empresas medianas.'
    }
  ],
  fotos: [
    { id: 1, titulo: 'Cumbre de Sostenibilidad Mar del Plata 2026', src: null, fecha: '22/04/2026' },
    { id: 2, titulo: 'Taller de huella de carbono para PyMES',       src: null, fecha: '18/04/2026' },
    { id: 3, titulo: 'Reforestación costera Provincia de Buenos Aires', src: null, fecha: '12/04/2026' }
  ],
  editoriales: [
    {
      id: 1,
      titulo: 'La trampa del greenwashing: cómo detectarlo y combatirlo',
      autor: 'Jorge Luis Landaburu',
      fecha: '26/04/2026',
      contenido: 'El greenwashing ya no es solo una práctica de marketing engañosa: es una amenaza sistémica para la credibilidad de la sostenibilidad corporativa. Cuando una empresa declara alcanzar "net zero" sin planes concretos de reducción, o cuando un producto lleva una etiqueta verde sin respaldo en indicadores verificables, se erosiona la confianza del consumidor y del inversor.\n\nEn América Latina, el problema se agrava por la ausencia de regulación específica. Mientras Europa avanza con la Directiva de Declaraciones Ecológicas y los requisitos de divulgación del CSRD, nuestras empresas operan en un vacío normativo que facilita las declaraciones ambiguas.\n\nLas herramientas para combatirlo existen: verificación por terceros, alineación con marcos como GRI o TCFD, y sobre todo, la adopción de la doble materialidad como principio rector. La comunidad de profesionales de la sostenibilidad tiene un rol central en esta batalla.',
      likes: 18,
      comentarios: [
        { autor: 'A. Benítez', texto: 'Excelente análisis. El TCFD es clave para esto.' }
      ]
    }
  ]
};

let fotoDataURLs = {};
let imgDataURLs  = {};
let currentFilter = 'todos';

/* ============================================================
   NAVEGACIÓN
   ============================================================ */

function showSection(section) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(section + 'Section').classList.add('active');

  document.querySelectorAll('nav button:not(.btn-publicar)').forEach((btn, i) => {
    btn.classList.remove('active');
    if (['feed', 'archivos', 'galeria', 'editoriales'][i] === section) {
      btn.classList.add('active');
    }
  });

  const hero = document.getElementById('heroSection');
  hero.style.display = section === 'feed' ? '' : 'none';

  renderAll();
}

/* ============================================================
   RENDER GENERAL
   ============================================================ */

function renderAll() {
  renderFeed();
  renderArchivos();
  renderGaleria();
  renderEditoriales();
  updateStats();
  renderTrending();
}

/* ============================================================
   RENDER FEED
   ============================================================ */

function renderFeed() {
  const c = document.getElementById('feedContainer');
  let items = data.feed;
  if (currentFilter !== 'todos') {
    items = items.filter(i => i.categoria === currentFilter);
  }
  if (!items.length) {
    c.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>No hay publicaciones en esta categoría todavía.</p></div>';
    return;
  }
  c.innerHTML = items.slice().reverse().map(item => {
    const tagClass = CATEGORIES[item.categoria] || 'verde';
    const imgSrc   = imgDataURLs[item.id] || null;
    return `<div class="card" data-cat="${item.categoria}">
      ${imgSrc
        ? `<img class="card-img" src="${imgSrc}" alt="">`
        : `<div class="card-img-placeholder">${CAT_ICONS[item.categoria] || '🌿'}</div>`}
      <div class="card-body">
        <div class="card-meta">
          <span class="tag tag-${tagClass}">${CAT_LABELS[item.categoria] || item.categoria}</span>
          <span class="card-date">${item.fecha}</span>
          <span class="card-author">por ${item.autor}</span>
        </div>
        <h2>${item.titulo}</h2>
        <p>${item.contenido.substring(0, 140)}...</p>
      </div>
      <div class="card-footer">
        <div class="card-actions">
          <button class="btn-sm ${item._liked ? 'liked' : ''}" onclick="toggleLike('feed',${item.id},this)">👍 ${item.likes}</button>
          <button class="btn-sm" onclick="toggleComments('feed-${item.id}')">💬 ${item.comentarios.length}</button>
        </div>
        <a class="read-more" href="#" onclick="openReader(event,'feed',${item.id})">Leer más →</a>
      </div>
      <div class="comments-section" id="comments-feed-${item.id}">
        ${item.comentarios.map(c => buildComment(c)).join('')}
        <div class="comment-input-row">
          <input class="comment-input" type="text" id="ci-feed-${item.id}" placeholder="Dejá tu opinión...">
          <button class="btn-comment" onclick="addComment('feed',${item.id})">Enviar</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ============================================================
   RENDER EDITORIALES
   ============================================================ */

function renderEditoriales() {
  const c = document.getElementById('editorialesContainer');
  if (!data.editoriales.length) {
    c.innerHTML = '<div class="empty-state"><div class="icon">✍️</div><p>Aún no hay editoriales. ¡Sé el primero en publicar!</p></div>';
    return;
  }
  c.innerHTML = data.editoriales.slice().reverse().map(item => `
    <div class="card">
      <div class="card-body">
        <div class="card-meta">
          <span class="tag tag-tierra">Editorial</span>
          <span class="card-date">${item.fecha}</span>
          <span class="card-author">por ${item.autor}</span>
        </div>
        <h2>${item.titulo}</h2>
        <p>${item.contenido.substring(0, 160)}...</p>
      </div>
      <div class="card-footer">
        <div class="card-actions">
          <button class="btn-sm ${item._liked ? 'liked' : ''}" onclick="toggleLike('editoriales',${item.id},this)">👍 ${item.likes}</button>
          <button class="btn-sm" onclick="toggleComments('ed-${item.id}')">💬 ${item.comentarios.length}</button>
        </div>
        <a class="read-more" href="#" onclick="openReader(event,'editorial',${item.id})">Leer completo →</a>
      </div>
      <div class="comments-section" id="comments-ed-${item.id}">
        ${item.comentarios.map(c => buildComment(c)).join('')}
        <div class="comment-input-row">
          <input class="comment-input" type="text" id="ci-ed-${item.id}" placeholder="Dejá tu opinión...">
          <button class="btn-comment" onclick="addComment('editoriales',${item.id})">Enviar</button>
        </div>
      </div>
    </div>`).join('');
}

/* ============================================================
   RENDER ARCHIVOS
   ============================================================ */

function renderArchivos() {
  const c = document.getElementById('archivosContainer');
  if (!data.archivos.length) {
    c.innerHTML = '<div class="empty-state"><div class="icon">📁</div><p>No hay documentos subidos todavía.</p></div>';
    return;
  }
  const iconMap = { pdf: '📄', xlsx: '📊', xls: '📊', doc: '📝', docx: '📝', ppt: '📋', pptx: '📋', txt: '📃' };
  const clsMap  = { pdf: 'pdf', xlsx: 'xlsx', xls: 'xlsx', doc: 'doc', docx: 'doc', ppt: 'doc', pptx: 'doc', txt: 'doc' };
  c.innerHTML = data.archivos.slice().reverse().map(f => {
    const ext = f.nombre.split('.').pop().toLowerCase();
    return `<div class="file-card">
      <div class="file-icon ${clsMap[ext] || 'doc'}">${iconMap[ext] || '📎'}</div>
      <div class="file-info">
        <div class="file-name">${f.nombre}</div>
        <div class="file-meta">${f.size} · Subido ${f.fecha} · ${f.autor}</div>
        ${f.desc ? `<div class="file-meta-desc">${f.desc}</div>` : ''}
      </div>
      <button class="btn-download" onclick="showToast('Descarga simulada ✓')">⬇ Descargar</button>
    </div>`;
  }).join('');
}

/* ============================================================
   RENDER GALERÍA
   ============================================================ */

function renderGaleria() {
  const c = document.getElementById('galeriaContainer');
  if (!data.fotos.length) {
    c.innerHTML = '<p style="color:var(--texto2);font-size:0.88rem;">No hay fotos todavía.</p>';
    return;
  }
  const icons = ['🌿', '🏔️', '🌊', '🌱', '☀️', '🌍'];
  c.innerHTML = data.fotos.slice().reverse().map((f, i) => {
    const src = fotoDataURLs[f.id];
    return `<div class="gallery-item" onclick="showToast('📷 ${f.titulo}')">
      ${src
        ? `<img src="${src}" alt="${f.titulo}">`
        : `<div class="gallery-item-placeholder">${icons[i % icons.length]}</div>`}
      <div class="gallery-label">${f.titulo}</div>
    </div>`;
  }).join('');
}

/* ============================================================
   HELPERS DE RENDER
   ============================================================ */

function buildComment(c) {
  return `<div class="comment">
    <div class="avatar">${c.autor[0]}</div>
    <div class="comment-bubble">
      <div class="comment-author">${c.autor}</div>
      <div class="comment-text">${c.texto}</div>
    </div>
  </div>`;
}

/* ============================================================
   ESTADÍSTICAS
   ============================================================ */

function updateStats() {
  const totalComments =
    data.feed.reduce((a, i) => a + i.comentarios.length, 0) +
    data.editoriales.reduce((a, i) => a + i.comentarios.length, 0);

  document.getElementById('statPub').textContent      = data.feed.length;
  document.getElementById('statArch').textContent     = data.archivos.length;
  document.getElementById('statFotos').textContent    = data.fotos.length;
  document.getElementById('statEdit').textContent     = data.editoriales.length;
  document.getElementById('statComments').textContent = totalComments;
}

/* ============================================================
   TRENDING
   ============================================================ */

function renderTrending() {
  const trending = [
    'Doble materialidad ESRS',
    'Huella de carbono Alcance 3',
    'Net Zero Argentina 2050',
    'GRI 305 — Emisiones',
    'TCFD y riesgos climáticos'
  ];
  document.getElementById('trendingContainer').innerHTML = trending.map((t, i) => `
    <div class="trending-item">
      <span class="trending-num">${i + 1}</span>
      <div>
        <div class="trending-text">${t}</div>
        <div class="trending-sub">${Math.floor(Math.random() * 80 + 20)} lecturas</div>
      </div>
    </div>`).join('');
}

/* ============================================================
   FILTROS
   ============================================================ */

function filterFeed(btn, cat) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = cat;
  renderFeed();
}

/* ============================================================
   LIKES & COMENTARIOS
   ============================================================ */

function toggleLike(tipo, id, btn) {
  const arr  = tipo === 'feed' ? data.feed : data.editoriales;
  const item = arr.find(i => i.id === id);
  if (!item) return;
  if (item._liked) { item.likes--; item._liked = false; }
  else             { item.likes++; item._liked = true; }
  btn.textContent = '👍 ' + item.likes;
  btn.classList.toggle('liked', item._liked);
}

function toggleComments(id) {
  const el = document.getElementById('comments-' + id);
  if (el) el.classList.toggle('open');
}

function addComment(tipo, id) {
  const prefix = tipo === 'feed' ? 'feed' : 'ed';
  const input  = document.getElementById('ci-' + prefix + '-' + id);
  if (!input || !input.value.trim()) return;
  const arr  = tipo === 'feed' ? data.feed : data.editoriales;
  const item = arr.find(i => i.id === id);
  if (!item) return;
  item.comentarios.push({ autor: 'Visitante', texto: input.value.trim() });
  renderAll();
  showToast('Comentario publicado ✓');
}

/* ============================================================
   READER MODAL
   ============================================================ */

function openReader(e, tipo, id) {
  e.preventDefault();
  let item;
  if (tipo === 'feed') item = data.feed.find(i => i.id === id);
  else                 item = data.editoriales.find(i => i.id === id);
  if (!item) return;

  document.getElementById('readerTitle').textContent = item.titulo;
  const imgSrc  = tipo === 'feed' ? imgDataURLs[item.id] : null;
  const content = item.contenido.split('\n').map(p => `<p>${p}</p>`).join('');

  document.getElementById('readerContent').innerHTML =
    `<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid var(--borde);">
      <span class="tag tag-${CATEGORIES[item.categoria] || 'tierra'}">${CAT_LABELS[item.categoria] || 'Editorial'}</span>
      <span style="font-size:0.78rem;color:var(--texto2);">por <strong>${item.autor}</strong> · ${item.fecha}</span>
    </div>
    ${imgSrc ? `<img class="reader-img" src="${imgSrc}" alt="">` : ''}
    ${content}`;

  document.getElementById('readerModal').classList.add('open');
}

/* ============================================================
   PUBLICAR MODAL
   ============================================================ */

function openPublishModal(tipo) {
  document.getElementById('publishModal').classList.add('open');
  if (tipo) {
    document.getElementById('pubType').value = tipo;
    updateModalType();
  }
}

function updateModalType() {
  const t = document.getElementById('pubType').value;
  document.getElementById('pubFormNoticia').style.display  = (t === 'noticia' || t === 'editorial') ? '' : 'none';
  document.getElementById('pubFormArchivo').style.display  = t === 'archivo' ? '' : 'none';
  document.getElementById('pubFormFoto').style.display     = t === 'foto'    ? '' : 'none';

  const titles = {
    noticia:   'Nueva actualización',
    editorial: 'Nueva editorial',
    archivo:   'Subir documento',
    foto:      'Subir foto'
  };
  document.getElementById('modalTitle').textContent = titles[t] || 'Nueva publicación';
}

function previewImg(input) {
  if (input.files && input.files[0]) {
    const r = new FileReader();
    r.onload = e => {
      document.getElementById('imgPreviewEl').src = e.target.result;
      document.getElementById('imgPreview').style.display = '';
    };
    r.readAsDataURL(input.files[0]);
  }
}

function handleArchFile(input) {
  if (input.files && input.files[0]) {
    document.getElementById('archFileName').textContent = input.files[0].name;
    const bar  = document.getElementById('archProgress');
    const fill = document.getElementById('archProgressFill');
    bar.style.display = '';
    let p = 0;
    const iv = setInterval(() => {
      p += 10;
      fill.style.width = p + '%';
      if (p >= 100) clearInterval(iv);
    }, 80);
  }
}

function handleFotoFile(input) {
  if (input.files && input.files[0]) {
    const r = new FileReader();
    r.onload = e => {
      document.getElementById('fotoPreviewEl').src = e.target.result;
      document.getElementById('fotoPreview').style.display = '';
    };
    r.readAsDataURL(input.files[0]);
  }
}

function submitPublication() {
  const tipo = document.getElementById('pubType').value;
  const now  = new Date();
  const fecha = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

  if (tipo === 'noticia' || tipo === 'editorial') {
    const titulo    = document.getElementById('pubTitulo').value.trim();
    const autor     = document.getElementById('pubAutor').value.trim() || 'Autor anónimo';
    const contenido = document.getElementById('pubContenido').value.trim();
    const categoria = document.getElementById('pubCategoria').value;
    if (!titulo || !contenido) { showToast('Completá título y contenido'); return; }

    const newId  = Date.now();
    const imgEl  = document.getElementById('imgPreviewEl');
    const imgSrc = document.getElementById('imgPreview').style.display !== 'none' ? imgEl.src : null;
    const item   = { id: newId, tipo, titulo, autor, fecha, categoria, contenido, img: null, likes: 0, comentarios: [] };

    if (tipo === 'editorial') data.editoriales.push(item);
    else                      data.feed.push(item);
    if (imgSrc) imgDataURLs[newId] = imgSrc;

  } else if (tipo === 'archivo') {
    const titulo = document.getElementById('archTitulo').value.trim();
    const desc   = document.getElementById('archDesc').value.trim();
    if (!titulo) { showToast('Ingresá un título para el documento'); return; }
    const input  = document.getElementById('archFileInput');
    const file   = input.files && input.files[0];
    const nombre = file ? file.name : (titulo + '.pdf');
    const size   = file
      ? (file.size < 1048576 ? Math.round(file.size / 1024) + ' KB' : (file.size / 1048576).toFixed(1) + ' MB')
      : '—';
    data.archivos.push({ id: Date.now(), nombre, tipo: 'pdf', autor: 'Jorge Luis Landaburu', fecha, size, desc });

  } else if (tipo === 'foto') {
    const titulo = document.getElementById('fotoTitulo').value.trim() || 'Foto sin título';
    const newId  = Date.now();
    const fotoEl = document.getElementById('fotoPreviewEl');
    const src    = document.getElementById('fotoPreview').style.display !== 'none' ? fotoEl.src : null;
    data.fotos.push({ id: newId, titulo, src: null, fecha });
    if (src) fotoDataURLs[newId] = src;
  }

  closeModal('publishModal');
  resetPublishForm();
  renderAll();

  if      (tipo === 'editorial') showSection('editoriales');
  else if (tipo === 'archivo')   showSection('archivos');
  else if (tipo === 'foto')      showSection('galeria');
  else                           showSection('feed');

  showToast('¡Publicado con éxito! ✓');
}

function resetPublishForm() {
  ['pubTitulo', 'pubAutor', 'pubContenido', 'archTitulo', 'archDesc', 'fotoTitulo'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('imgPreview').style.display  = 'none';
  document.getElementById('fotoPreview').style.display = 'none';
  document.getElementById('archFileName').textContent  = 'Ningún archivo seleccionado';
  document.getElementById('archProgress').style.display = 'none';
  document.getElementById('archProgressFill').style.width = '0%';
  ['pubImgInput', 'archFileInput', 'fotoFileInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ============================================================
   MODALES — HELPERS
   ============================================================ */

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeOnOverlay(e, id) {
  if (e.target.id === id) closeModal(id);
}

/* ============================================================
   TOAST
   ============================================================ */

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ============================================================
   INIT
   ============================================================ */

updateModalType();
renderAll();
