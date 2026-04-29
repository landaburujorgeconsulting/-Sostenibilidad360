/* ============================================================
   SOSTENIBILIDAD 360° — app.js
   Jorge Luis Landaburu
   Firebase: Firestore + Auth | Cloudinary: Storage
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, increment, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ============================================================
   ⚙️  CONFIGURACIÓN FIREBASE
   Reemplazá estos valores con los de tu proyecto en Firebase Console
   ============================================================ */
const firebaseConfig = {
  apiKey:            "AIzaSyBrudAYqtfo42yc-eOMq52gbTLFfle4E4g",
  authDomain:        "sostenibilidad360-94ea0.firebaseapp.com",
  projectId:         "sostenibilidad360-94ea0",
  storageBucket:     "sostenibilidad360-94ea0.firebasestorage.app",
  messagingSenderId: "241520204708",
  appId:             "1:241520204708:web:2008474b041246f7f57f31"
};

/* ============================================================
   ⚙️  CONFIGURACIÓN CLOUDINARY
   ============================================================ */
const CLOUDINARY_CLOUD = "dzkhkj4w5";
const CLOUDINARY_PRESET = "sostenibilidad360"; // lo vas a crear en el paso de abajo

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* ============================================================
   CONSTANTES
   ============================================================ */
const CATEGORIES = { clima:'verde', esg:'azul', ods:'tierra', empresa:'acento', otros:'tierra' };
const CAT_LABELS  = { clima:'Clima', esg:'ESG / GRI', ods:'ODS', empresa:'Empresas', otros:'Otros' };
const CAT_ICONS   = { clima:'🌍', esg:'📊', ods:'🎯', empresa:'🏢', otros:'📌' };
const FILE_ICONS  = { pdf:'📄', xlsx:'📊', xls:'📊', doc:'📝', docx:'📝', ppt:'📋', pptx:'📋', txt:'📃' };
const FILE_CLS    = { pdf:'pdf', xlsx:'xlsx', xls:'xlsx', doc:'doc', docx:'doc', ppt:'doc', pptx:'doc', txt:'doc' };

let currentFilter = 'todos';
let isAdmin = false;

/* ============================================================
   AUTH
   ============================================================ */
onAuthStateChanged(auth, user => {
  isAdmin = !!user;
  const adminBtn       = document.getElementById('adminBtn');
  const adminBtnMobile = document.getElementById('adminBtnMobile');
  if (user) {
    adminBtn.textContent       = '🔓 Salir';
    adminBtnMobile.textContent = '🔓 Cerrar sesión';
    adminBtn.classList.add('logged-in');
    showToast('Sesión iniciada como administrador ✓');
  } else {
    adminBtn.textContent       = '🔐 Admin';
    adminBtnMobile.textContent = '🔐 Admin';
    adminBtn.classList.remove('logged-in');
  }
  renderAll();
});

function handleAdminClick() {
  if (isAdmin) {
    signOut(auth);
  } else {
    openModal('loginModal');
    setTimeout(() => document.getElementById('loginEmail').focus(), 100);
  }
}
window.handleAdminClick = handleAdminClick;

async function doLogin() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  errEl.style.display = 'none';
  try {
    await signInWithEmailAndPassword(auth, email, password);
    closeModal('loginModal');
    document.getElementById('loginEmail').value    = '';
    document.getElementById('loginPassword').value = '';
  } catch(e) {
    errEl.textContent   = 'Email o contraseña incorrectos.';
    errEl.style.display = 'block';
  }
}
window.doLogin = doLogin;

/* ============================================================
   NAVEGACIÓN
   ============================================================ */
function showSection(section) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.getElementById(section + 'Section').classList.add('active');
  document.querySelectorAll('#navDesktop button:not(.btn-publicar):not(.btn-admin)').forEach((btn, i) => {
    btn.classList.toggle('active', ['feed','archivos','galeria','editoriales'][i] === section);
  });
  document.getElementById('heroSection').style.display = section === 'feed' ? '' : 'none';
}
window.showSection = showSection;

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}
window.toggleMobileMenu = toggleMobileMenu;

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
window.closeMobileMenu = closeMobileMenu;

/* ============================================================
   CLOUDINARY UPLOAD
   ============================================================ */
async function uploadToCloudinary(file, tipo) {
  const statusEl = document.getElementById('uploadStatus');
  const fillEl   = document.getElementById('uploadProgressFill');
  const textEl   = document.getElementById('uploadStatusText');
  statusEl.style.display = '';
  textEl.textContent = 'Subiendo archivo...';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('folder', tipo === 'foto' ? 'fotos' : tipo === 'imagen' ? 'imagenes' : 'archivos');

  // Para archivos no imagen usamos resource_type=raw
  const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        const pct = Math.round(e.loaded / e.total * 100);
        fillEl.style.width  = pct + '%';
        textEl.textContent  = `Subiendo... ${pct}%`;
      }
    };
    xhr.onload = () => {
      statusEl.style.display = 'none';
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve({ url: res.secure_url, publicId: res.public_id });
      } else {
        reject(new Error('Error al subir a Cloudinary'));
      }
    };
    xhr.onerror = () => reject(new Error('Error de red'));
    xhr.send(formData);
  });
}

/* ============================================================
   RENDER
   ============================================================ */
async function renderAll() {
  await Promise.all([renderFeed(), renderArchivos(), renderGaleria(), renderEditoriales()]);
  updateStats();
  renderTrending();
}

async function renderFeed() {
  const c = document.getElementById('feedContainer');
  try {
    const q    = query(collection(db, 'feed'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    let items  = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (currentFilter !== 'todos') items = items.filter(i => i.categoria === currentFilter);
    if (!items.length) { c.innerHTML = '<div class="empty-state"><div class="icon">📭</div><p>No hay publicaciones todavía.</p></div>'; return; }
    c.innerHTML = items.map(item => buildCard(item, 'feed')).join('');
  } catch(e) {
    c.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Error al cargar. Verificá la configuración de Firebase.</p></div>';
  }
}

async function renderEditoriales() {
  const c = document.getElementById('editorialesContainer');
  try {
    const q    = query(collection(db, 'editoriales'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) { c.innerHTML = '<div class="empty-state"><div class="icon">✍️</div><p>Aún no hay editoriales. ¡Sé el primero en publicar!</p></div>'; return; }
    c.innerHTML = items.map(item => buildCard(item, 'editoriales')).join('');
  } catch(e) {
    c.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Error al cargar.</p></div>';
  }
}

function buildCard(item, col) {
  const tagClass = CATEGORIES[item.categoria] || 'tierra';
  const tagLabel = CAT_LABELS[item.categoria] || (col === 'editoriales' ? 'Editorial' : 'Nota');
  const delBtn   = isAdmin ? `<button class="btn-sm btn-delete" onclick="deleteItem('${col}','${item.id}','${item.publicId||''}')">🗑 Borrar</button>` : '';
  return `<div class="card">
    ${item.imgUrl ? `<img class="card-img" src="${item.imgUrl}" alt="">` : `<div class="card-img-placeholder">${CAT_ICONS[item.categoria]||'🌿'}</div>`}
    <div class="card-body">
      <div class="card-meta">
        <span class="tag tag-${tagClass}">${tagLabel}</span>
        <span class="card-date">${item.fecha||''}</span>
        <span class="card-author">por ${item.autor||''}</span>
      </div>
      <h2>${item.titulo}</h2>
      <p>${(item.contenido||'').substring(0,140)}...</p>
    </div>
    <div class="card-footer">
      <div class="card-actions">
        <button class="btn-sm" onclick="toggleLike('${col}','${item.id}',this)">👍 ${item.likes||0}</button>
        <button class="btn-sm" onclick="toggleComments('${col}-${item.id}')">💬 ${(item.comentarios||[]).length}</button>
        ${delBtn}
      </div>
      <a class="read-more" href="#" onclick="openReader(event,'${col}','${item.id}')">Leer más →</a>
    </div>
    <div class="comments-section" id="comments-${col}-${item.id}">
      ${(item.comentarios||[]).map(buildComment).join('')}
      <div class="comment-input-row">
        <input class="comment-input" type="text" id="ci-${col}-${item.id}" placeholder="Dejá tu opinión...">
        <button class="btn-comment" onclick="addComment('${col}','${item.id}')">Enviar</button>
      </div>
    </div>
  </div>`;
}

async function renderArchivos() {
  const c = document.getElementById('archivosContainer');
  try {
    const q    = query(collection(db, 'archivos'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) { c.innerHTML = '<div class="empty-state"><div class="icon">📁</div><p>No hay documentos todavía.</p></div>'; return; }
    c.innerHTML = items.map(f => {
      const ext    = (f.nombre||'').split('.').pop().toLowerCase();
      const delBtn = isAdmin ? `<button class="btn-sm btn-delete" onclick="deleteItem('archivos','${f.id}','${f.publicId||''}')">🗑</button>` : '';
      return `<div class="file-card">
        <div class="file-icon ${FILE_CLS[ext]||'doc'}">${FILE_ICONS[ext]||'📎'}</div>
        <div class="file-info">
          <div class="file-name">${f.nombre}</div>
          <div class="file-meta">${f.size||''} · ${f.fecha||''} · ${f.autor||''}</div>
          ${f.desc ? `<div class="file-meta-desc">${f.desc}</div>` : ''}
        </div>
        <div class="file-actions">
          ${f.downloadUrl ? `<a class="btn-download" href="${f.downloadUrl}" target="_blank">⬇ Descargar</a>` : ''}
          ${delBtn}
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    c.innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><p>Error al cargar.</p></div>';
  }
}

async function renderGaleria() {
  const c = document.getElementById('galeriaContainer');
  try {
    const q    = query(collection(db, 'fotos'), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) { c.innerHTML = '<div class="empty-state"><div class="icon">🖼️</div><p>No hay fotos todavía.</p></div>'; return; }
    const icons = ['🌿','🏔️','🌊','🌱','☀️','🌍'];
    c.innerHTML = items.map((f, i) => `
      <div class="gallery-item">
        ${f.downloadUrl ? `<img src="${f.downloadUrl}" alt="${f.titulo}">` : `<div class="gallery-item-placeholder">${icons[i%icons.length]}</div>`}
        <div class="gallery-label">${f.titulo}</div>
        ${isAdmin ? `<button class="gallery-delete" onclick="deleteItem('fotos','${f.id}','${f.publicId||''}')">✕</button>` : ''}
      </div>`).join('');
  } catch(e) { c.innerHTML = ''; }
}

function buildComment(c) {
  return `<div class="comment">
    <div class="avatar">${(c.autor||'?')[0].toUpperCase()}</div>
    <div class="comment-bubble">
      <div class="comment-author">${c.autor}</div>
      <div class="comment-text">${c.texto}</div>
    </div>
  </div>`;
}

/* ============================================================
   ESTADÍSTICAS & TRENDING
   ============================================================ */
async function updateStats() {
  try {
    const [f, a, fo, e] = await Promise.all([
      getDocs(collection(db,'feed')),
      getDocs(collection(db,'archivos')),
      getDocs(collection(db,'fotos')),
      getDocs(collection(db,'editoriales'))
    ]);
    document.getElementById('statPub').textContent   = f.size;
    document.getElementById('statArch').textContent  = a.size;
    document.getElementById('statFotos').textContent = fo.size;
    document.getElementById('statEdit').textContent  = e.size;
  } catch(e) {}
}

function renderTrending() {
  const items = ['Doble materialidad ESRS','Huella de carbono Alcance 3','Net Zero Argentina 2050','GRI 305 — Emisiones','TCFD y riesgos climáticos'];
  document.getElementById('trendingContainer').innerHTML = items.map((t, i) => `
    <div class="trending-item">
      <span class="trending-num">${i+1}</span>
      <div><div class="trending-text">${t}</div><div class="trending-sub">${Math.floor(Math.random()*80+20)} lecturas</div></div>
    </div>`).join('');
}

/* ============================================================
   FILTROS / LIKES / COMENTARIOS
   ============================================================ */
function filterFeed(btn, cat) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = cat;
  renderFeed();
}
window.filterFeed = filterFeed;

async function toggleLike(col, id, btn) {
  try {
    await updateDoc(doc(db, col, id), { likes: increment(1) });
    const cur = parseInt(btn.textContent.replace('👍 ','')) + 1;
    btn.textContent = '👍 ' + cur;
    btn.classList.add('liked');
  } catch(e) {}
}
window.toggleLike = toggleLike;

function toggleComments(id) {
  document.getElementById('comments-' + id)?.classList.toggle('open');
}
window.toggleComments = toggleComments;

async function addComment(col, id) {
  const input = document.getElementById(`ci-${col}-${id}`);
  if (!input || !input.value.trim()) return;
  const texto = input.value.trim();
  try {
    const snap = await getDocs(collection(db, col));
    const item = snap.docs.find(d => d.id === id);
    const comentarios = [...(item?.data().comentarios || []), { autor: 'Visitante', texto }];
    await updateDoc(doc(db, col, id), { comentarios });
    input.value = '';
    renderAll();
    showToast('Comentario publicado ✓');
  } catch(e) { showToast('Error al publicar comentario'); }
}
window.addComment = addComment;

/* ============================================================
   READER
   ============================================================ */
async function openReader(e, col, id) {
  e.preventDefault();
  try {
    const snap = await getDocs(collection(db, col));
    const item = snap.docs.find(d => d.id === id)?.data();
    if (!item) return;
    document.getElementById('readerTitle').textContent = item.titulo;
    const content = (item.contenido||'').split('\n').map(p => `<p>${p}</p>`).join('');
    document.getElementById('readerContent').innerHTML =
      `<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid var(--borde);">
        <span class="tag tag-${CATEGORIES[item.categoria]||'tierra'}">${CAT_LABELS[item.categoria]||'Editorial'}</span>
        <span style="font-size:0.78rem;color:var(--texto2);">por <strong>${item.autor||''}</strong> · ${item.fecha||''}</span>
      </div>
      ${item.imgUrl ? `<img class="reader-img" src="${item.imgUrl}" alt="">` : ''}
      ${content}`;
    openModal('readerModal');
  } catch(e) { showToast('Error al cargar el artículo'); }
}
window.openReader = openReader;

/* ============================================================
   DELETE (solo admin)
   ============================================================ */
async function deleteItem(col, id, publicId) {
  if (!isAdmin) return;
  if (!confirm('¿Seguro que querés borrar esto?')) return;
  try {
    await deleteDoc(doc(db, col, id));
    renderAll();
    showToast('Eliminado ✓');
  } catch(e) { showToast('Error al eliminar'); }
}
window.deleteItem = deleteItem;

/* ============================================================
   PUBLICAR
   ============================================================ */
function openPublishModal(tipo) {
  openModal('publishModal');
  if (tipo) { document.getElementById('pubType').value = tipo; updateModalType(); }
}
window.openPublishModal = openPublishModal;

function updateModalType() {
  const t = document.getElementById('pubType').value;
  document.getElementById('pubFormNoticia').style.display  = (t==='noticia'||t==='editorial') ? '' : 'none';
  document.getElementById('pubFormArchivo').style.display  = t==='archivo' ? '' : 'none';
  document.getElementById('pubFormFoto').style.display     = t==='foto'    ? '' : 'none';
  const titles = { noticia:'Nueva actualización', editorial:'Nueva editorial', archivo:'Subir documento', foto:'Subir foto' };
  document.getElementById('modalTitle').textContent = titles[t]||'Nueva publicación';
}
window.updateModalType = updateModalType;

function previewImg(input) {
  if (input.files?.[0]) {
    const r = new FileReader();
    r.onload = e => { document.getElementById('imgPreviewEl').src = e.target.result; document.getElementById('imgPreview').style.display = ''; };
    r.readAsDataURL(input.files[0]);
  }
}
window.previewImg = previewImg;

function handleArchFile(input) {
  if (input.files?.[0]) document.getElementById('archFileName').textContent = input.files[0].name;
}
window.handleArchFile = handleArchFile;

function handleFotoFile(input) {
  if (input.files?.[0]) {
    const r = new FileReader();
    r.onload = e => { document.getElementById('fotoPreviewEl').src = e.target.result; document.getElementById('fotoPreview').style.display = ''; };
    r.readAsDataURL(input.files[0]);
  }
}
window.handleFotoFile = handleFotoFile;

function getFecha() {
  const n = new Date();
  return `${String(n.getDate()).padStart(2,'0')}/${String(n.getMonth()+1).padStart(2,'0')}/${n.getFullYear()}`;
}

async function submitPublication() {
  const tipo      = document.getElementById('pubType').value;
  const fecha     = getFecha();
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;

  try {
    if (tipo === 'noticia' || tipo === 'editorial') {
      const titulo    = document.getElementById('pubTitulo').value.trim();
      const autor     = document.getElementById('pubAutor').value.trim() || 'Anónimo';
      const contenido = document.getElementById('pubContenido').value.trim();
      const categoria = document.getElementById('pubCategoria').value;
      if (!titulo || !contenido) { showToast('Completá título y contenido'); submitBtn.disabled=false; return; }

      let imgUrl = null, publicId = null;
      const imgFile = document.getElementById('pubImgInput').files?.[0];
      if (imgFile) {
        const res = await uploadToCloudinary(imgFile, 'imagen');
        imgUrl = res.url; publicId = res.publicId;
      }
      const col = tipo === 'editorial' ? 'editoriales' : 'feed';
      await addDoc(collection(db, col), { titulo, autor, contenido, categoria, fecha, likes: 0, comentarios: [], imgUrl, publicId, timestamp: serverTimestamp() });

    } else if (tipo === 'archivo') {
      const titulo = document.getElementById('archTitulo').value.trim();
      const desc   = document.getElementById('archDesc').value.trim();
      if (!titulo) { showToast('Ingresá un título'); submitBtn.disabled=false; return; }
      const file = document.getElementById('archFileInput').files?.[0];
      if (!file) { showToast('Seleccioná un archivo'); submitBtn.disabled=false; return; }
      const size = file.size < 1048576 ? Math.round(file.size/1024)+' KB' : (file.size/1048576).toFixed(1)+' MB';
      const { url, publicId } = await uploadToCloudinary(file, 'archivo');
      await addDoc(collection(db, 'archivos'), { nombre: file.name, titulo, desc, autor: 'Jorge Luis Landaburu', fecha, size, downloadUrl: url, publicId, timestamp: serverTimestamp() });

    } else if (tipo === 'foto') {
      const titulo = document.getElementById('fotoTitulo').value.trim() || 'Foto sin título';
      const file   = document.getElementById('fotoFileInput').files?.[0];
      if (!file) { showToast('Seleccioná una imagen'); submitBtn.disabled=false; return; }
      const { url, publicId } = await uploadToCloudinary(file, 'foto');
      await addDoc(collection(db, 'fotos'), { titulo, fecha, downloadUrl: url, publicId, timestamp: serverTimestamp() });
    }

    closeModal('publishModal');
    resetForm();
    renderAll();
    const secciones = { noticia:'feed', editorial:'editoriales', archivo:'archivos', foto:'galeria' };
    showSection(secciones[tipo]||'feed');
    showToast('¡Publicado con éxito! ✓');

  } catch(e) {
    console.error(e);
    showToast('Error al publicar. Verificá la configuración.');
  }
  submitBtn.disabled = false;
}
window.submitPublication = submitPublication;

function resetForm() {
  ['pubTitulo','pubAutor','pubContenido','archTitulo','archDesc','fotoTitulo'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('imgPreview').style.display  = 'none';
  document.getElementById('fotoPreview').style.display = 'none';
  document.getElementById('archFileName').textContent  = 'Ningún archivo seleccionado';
  document.getElementById('uploadStatus').style.display = 'none';
  document.getElementById('uploadProgressFill').style.width = '0%';
  ['pubImgInput','archFileInput','fotoFileInput'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

/* ============================================================
   MODAL HELPERS
   ============================================================ */
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeOnOverlay(e, id) { if (e.target.id === id) closeModal(id); }
window.openModal = openModal;
window.closeModal = closeModal;
window.closeOnOverlay = closeOnOverlay;

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
window.showToast = showToast;

/* ============================================================
   INIT
   ============================================================ */
updateModalType();
renderTrending();
renderAll();
