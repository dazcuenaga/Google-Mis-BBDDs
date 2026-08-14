# Mis Hojas — app móvil (PWA) para tus Google Sheets

App web instalable ("Añadir a pantalla de inicio") que lee y escribe directamente en
varias de tus hojas de cálculo. No usa servidor propio: habla directo con la API de
Google Sheets desde el navegador, con tu cuenta de Google.

Al entrar, tras iniciar sesión, eliges qué **módulo** quieres usar:

- **🧊 Congelados** — inventario de nevera/arcón (hoja `Congelados`, pestaña `Contenido`).
- **✅ Family To Dos** — tareas pendientes por casa (hoja `Family To Dos`); dentro se elige
  el tablero: Cabaña, Cisneros, Clínica o General.
- **📚 Lista de Lectura** — libros pendientes/leídos (hoja `Lista de Lectura`).

En cada módulo puedes: ver el listado (con buscador y filtros), añadir una fila nueva,
y tocar cualquier fila para editarla o eliminarla.

Añadir un módulo nuevo más adelante (tienes más hojas en la misma carpeta de Drive) es
sencillo: se define en `config.js` sin tocar el resto del código. Dímelo cuando quieras y
lo añadimos.

## 1. Crear las credenciales de Google (una sola vez)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) e inicia sesión con
   `dazcuenaga@gmail.com` (la misma cuenta dueña de las hojas).
2. Crea un proyecto nuevo (o usa uno existente), por ejemplo `Mis Hojas App`.
3. En el menú lateral, ve a **APIs y servicios → Biblioteca**, busca **Google Sheets API**
   y pulsa **Habilitar**.
4. Ve a **APIs y servicios → Pantalla de consentimiento OAuth**:
   - Tipo de usuario: **Externo**.
   - Rellena nombre de la app (`Mis Hojas`) y tu correo.
   - En "Scopes" no hace falta añadir nada a mano.
   - En **Usuarios de prueba**, añade tu propio correo (`dazcuenaga@gmail.com`) — mientras
     la app esté en modo "Prueba" solo los correos que añadas aquí podrán iniciar sesión.
5. Ve a **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**:
   - Tipo de aplicación: **Aplicación web**.
   - Nombre: `Mis Hojas Web`.
   - En **Orígenes autorizados de JavaScript** añade la URL desde la que abrirás la app,
     por ejemplo `http://localhost:5500` (ver paso 2 para elegir el puerto).
   - Guarda y copia el **ID de cliente** (termina en `.apps.googleusercontent.com`).
6. Abre [`config.js`](config.js) en esta carpeta y pega tu ID de cliente en `CLIENT_ID`.

El mismo permiso (`spreadsheets`) da acceso a cualquier hoja de tu Drive, así que no hace
falta repetir este proceso al añadir más módulos/hojas.

## 2. Ejecutar la app en local

Los navegadores no permiten el login de Google si abres `index.html` directamente
(`file://`), así que hay que servirla con un pequeño servidor local. Con Node instalado:

```bash
npx serve -l 5500 .
```

o con Python:

```bash
python -m http.server 5500
```

Luego abre `http://localhost:5500` en el navegador de tu ordenador (el puerto debe
coincidir con el que pusiste como "origen autorizado" en el paso 1).

Para verla con aspecto de móvil, usa el modo responsive del navegador (F12 → icono de
móvil/tablet).

## 3. Cuando quieras usarla desde tu teléfono de verdad

Google exige que el origen sea `https://` (excepto `localhost`), así que para instalarla
en tu móvil necesitas publicarla en un hosting con HTTPS (GitHub Pages, Vercel, Netlify…
todas tienen plan gratuito). Cuando quieras dar ese paso:

1. Sube esta carpeta a un repositorio y actívalo en GitHub Pages (o Vercel/Netlify).
2. Añade la URL pública (ej. `https://tuusuario.github.io/mis-hojas`) como nuevo
   **origen autorizado de JavaScript** en las credenciales del paso 1.
3. Abre esa URL desde el navegador del móvil y usa "Añadir a pantalla de inicio".

Dímelo cuando quieras dar este paso y te ayudo a desplegarla.

## Notas sobre los datos

- **Congelados**: la columna **Cantidad Congelada** se recalcula como `Metida − Sacada`
  cada vez que añades o editas un producto, igual que la fórmula que ya tenía tu hoja.
- **Family To Dos**: el tablero "Cabaña" tiene una columna extra (`Coste Estimado`) que
  los demás tableros (Cisneros, Clínica, General) no tienen; la app respeta esa diferencia
  de columnas automáticamente en cada tablero.
- Las fechas se guardan como `dd/mm/aaaa`, igual que en tus hojas actuales.
- Eliminar un elemento en la app borra esa fila completa de la hoja (no se puede deshacer
  desde la app, aunque sí desde el historial de versiones de Google Sheets).
