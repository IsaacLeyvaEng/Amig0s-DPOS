# 🎬 Broma: "Espera, te tomaré una foto"

Página de una sola vista con la siguiente secuencia:

1. Aparece una foto (placeholder) con el texto **"Espera, te tomaré una foto..."**
2. A los 2.4s se dispara un **flash blanco** de cámara.
3. Aparece la foto de un **mono sonriendo**.
4. Se abre un modal: **"¿Quieres escuchar una canción?"**
   - Si dice **No** → aparece un mono llorando con el texto **"Dale que sííí"** y un botón para reintentar.
   - Si dice **Sí** → pregunta otra vez: **"¿En serio quieres escuchar una canción?"**
     - Si dice **No** → mono llorando.
     - Si dice **Sí** → pregunta la tercera vez: **"¿De veritas de veritas quieres escuchar una canción?"**
       - Si dice **No** → mono llorando.
       - Si dice **Sí** → la página **se recarga** y se reproduce la canción **"Amigos"** de la banda peruana **DPOS**, mostrando el mono sonriendo y la letra a la izquierda.

---

## ⚠️ Antes de subirla: reemplaza tus archivos

Por temas de derechos de autor, **no incluí el audio real ni la letra de la canción** — solo dejé todo listo para que tú los pongas. Reemplaza estos archivos dentro de `assets/` **con el mismo nombre exacto**:

| Archivo actual (placeholder) | Reemplázalo con |
|---|---|
| `assets/jungkook.jpg` | Tu foto de Jungkook con una cámara |
| `assets/mono-sonriendo.png` | Tu imagen del mono sonriendo |
| `assets/mono-llorando.png` | Tu imagen del mono llorando |
| `assets/amigos-dpos.mp3` | El mp3 real de "Amigos" de DPOS (actualmente es 1 segundo de silencio) |

Y en `index.html`, busca este bloque y **pega ahí la letra real** de la canción:

```html
<p class="lyrics-text" id="lyrics-text">
  [ Pega aquí la letra de "Amigos" de DPOS ]
</p>
```

(Puedes usar `<br>` para separar cada línea, o simplemente saltos de línea — el CSS ya respeta los saltos con `white-space: pre-line`.)

> 💡 Tip: si tus imágenes tienen otro nombre o extensión (ej. `.png` en vez de `.jpg`), actualiza la ruta correspondiente en `index.html` (busca las etiquetas `<img src="...">`).

---

## 🖥️ Probarla en local

No necesitas servidor, pero es más seguro correr un mini servidor local (el `autoplay` y `fetch` de audio a veces fallan con `file://`):

```bash
cd broma-jungkook
python3 -m http.server 8000
```

Abre `http://localhost:8000` en tu navegador.

---

## 🐙 Subir a GitHub

```bash
cd broma-jungkook
git init
git add .
git commit -m "Broma inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

(Crea antes el repo vacío en GitHub y reemplaza `TU_USUARIO/TU_REPO`.)

---

## 🚀 Desplegar en Render (gratis, como sitio estático)

1. Entra a [render.com](https://render.com) y conecta tu cuenta de GitHub.
2. Click en **New +** → **Static Site**.
3. Elige el repositorio que acabas de subir.
4. Configuración:
   - **Build Command**: (déjalo vacío, no hay build)
   - **Publish directory**: `.` (la raíz del repo, ya que `index.html` está en la raíz)
5. Click en **Create Static Site**.
6. En un par de minutos te dará una URL tipo `https://tu-broma.onrender.com` — ese es el link que le mandas a la persona 😏

---

## 📁 Estructura del proyecto

```
broma-jungkook/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── jungkook.jpg        ← reemplázala
    ├── mono-sonriendo.png  ← reemplázala
    ├── mono-llorando.png   ← reemplázala
    └── amigos-dpos.mp3     ← reemplázala
```

---

## 🔊 Nota sobre el autoplay

Algunos navegadores (especialmente en celular) bloquean el audio automático si no hubo interacción previa del usuario justo antes de la recarga. Por eso dejé un botón de respaldo **"▶ Reproducir canción"** que aparece automáticamente si el navegador bloquea el autoplay — así nunca se queda en silencio.
