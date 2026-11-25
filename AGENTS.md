<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Station content lives in `src/lib/content.ts` (defaults) and is edited via `/admin`, persisted in browser localStorage; map layout in `src/lib/map.ts`. Why: content changes without touching game code.

---

# Contexto del proyecto (para cualquier agente: Claude Code, Antigravity, etc.)

## Qué es
"Little Learning Land": juego educativo web en español. El usuario ve un inicio, crea un avatar, y recorre una tienda tipo **Homecenter (Sodimac Colombia)** con 5 estaciones de información. Es un proyecto académico (contratación internacional) sobre el Joint Venture **Organización Corona + Grupo Falabella**. Origen: proyecto de Lovable `c6ee37d9-9867-5bc7-8b1a-bd74364a9653`, copiado a esta carpeta local para seguir editándolo aquí. El usuario habla español: responde y comenta en español.

## Cómo correrlo (usar pnpm, no hay bun instalado)
```
pnpm install
pnpm dev            # http://localhost:8080
pnpm exec tsc --noEmit
pnpm test           # vitest, 1 test de enrutamiento
```
Stack: React 19 + TanStack Start/Router (rutas por archivo) + Vite 8 + Tailwind v4 (config en `src/styles.css`, sin tailwind.config) + shadcn/ui (`src/components/ui`, no tocar salvo necesidad). El juego se dibuja en un `<canvas>` 2D.

## Flujo de pantallas (`src/routes/index.tsx`, estado `screen`)
`welcome` → `editor` → `world`. Ruta aparte `/admin` (`src/routes/admin.tsx`) para editar el contenido de las estaciones.

| Pantalla | Archivo | Estado |
|---|---|---|
| Inicio | `src/components/Welcome.tsx` | Rediseñado: copia el hero del proyecto Lovable `25cc0b45-9647-4d4a-83f6-b6baee462723` (Corona × Falabella, fondo `public/store-welcome.png`, fuentes Barlow + DM Sans cargadas en `__root.tsx`). |
| Editor de avatar | `src/components/AvatarEditor.tsx`, `src/lib/avatar.ts` | **El usuario pidió NO cambiarlo.** |
| Mundo | `src/components/World.tsx`, `src/lib/map.ts` | Rediseñado a vista **isométrica 2.5D**, mapa pequeño 14x10. |
| Modales | `StationModal.tsx`, `BookModal.tsx` | Sin cambios. |

## Mundo isométrico (cómo funciona)
- `src/lib/map.ts`: `COLS=14, ROWS=10`, rombo `TW=64/TH=32`, `toScreen(gx,gy)`, `buildMap()` (layout de la tienda), `SOLID` (casillas que bloquean), `SIGNS` (letreros sobre la pared norte por columna). Solo hay paredes al norte (y=0) y oeste (x=0); sur/este abiertos (casilla `void`, sin piso). Zona caminable: x 1..12, y 1..8.
- `World.tsx`: helpers `box()` (prisma con 3 caras) y `face()` (rectángulo sobre una cara) componen todos los objetos con volumen (`drawObj`, `drawStation`, `drawWall`, `drawFloor`). Orden de dibujo: piso → paredes → objetos/estaciones/avatar ordenados por `x+y` (algoritmo del pintor).
- Movimiento en coordenadas de casilla (float). Las teclas (flechas/WASD) se leen en pantalla y se convierten a la cuadrícula (`gx=sx+sy, gy=sy-sx`). Colisión por casilla (`SOLID` + casillas de estaciones). Interacción: tecla X/E/Enter cerca de una estación (distancia < 1.5 casillas).
- Para agregar un objeto: añadir el nombre al tipo `Tile` y a `SOLID` en `map.ts`, colocarlo en `buildMap()` y dibujarlo en el `switch` de `drawObj`.
- Si el canvas cambia de tamaño, ajustar `OX, OY, W, H` en `map.ts` y la razón de aspecto `768/500` en la clase del `<canvas>` en `World.tsx`.

## Contenido de estaciones
- Defaults en `src/lib/content.ts` (`DEFAULT_STATIONS`, 5 estaciones: s1 register (6,7), s2 globe (3,4), s3 books (10,2), s4 tools (10,6), s5 book (3,7)). El admin las edita y se guardan en `localStorage` (clave `corona-falabella-stations-v2`).
- Coordenadas de estación: columna 1..12, fila 1..8. `World` las acomoda con clamp si vienen de guardados viejos (mapa anterior era 20x14).
- El libro (s5, contrato de Joint Venture) contiene el texto íntegro y formal del contrato académico (cláusulas primera a décima cuarta, comparecencia y firmas de Organización Corona e Inversiones Falabella de Colombia).
- Avatar guardado en `localStorage` (`mundo-avatar-v1`).

## Reglas / convenciones
- Mantén el bloque `LOVABLE:BEGIN/END` de este archivo intacto. No edites archivos marcados como generados (`src/routeTree.gen.ts`). No hay base de datos.
- Todos los colores de tokens en `styles.css` van en `oklch`; los dibujos del canvas usan hex directos.
- Estilo de código existente: denso, una línea por función. ESLint+Prettier se quejan del formato en ese código (`pnpm lint`); no es un error funcional, no reformatear archivos enteros sin pedirlo.
- Verifica con `pnpm exec tsc --noEmit` y `pnpm test` antes de dar algo por terminado, y revisa visualmente en el navegador (inicio → avatar → mundo → abrir una estación con X).

## Historial de cambios locales
1. Copia completa del código de Lovable a esta carpeta (83 archivos; falta `public/favicon.ico`, binario).
2. Inicio nuevo (hero Corona × Falabella) y título/meta de la página actualizados.
3. Mapa pasado de cenital plano 20x14 a isométrico con volumen 14x10 (estilo Homecenter: neveras, vajilla, lavamanos, inodoros, pinturas, góndolas, herramientas, banderas CO/CL, plantas, mostrador).
4. Alineación completa con el documento académico "Contratacion internacional-modalidades de exportación" (UFPS):
   - Actualización de `src/lib/content.ts` con historia empresarial en 4 etapas, otros JV de Corona (Alión, Eternit, Lanco, Vicrila), marco legal colombiano (Art. 18 Estatuto Tributario, DIAN, NIIF), tabla comparativa Contractual vs Societario, balance real (liderazgo frente a Easy/Cencosud, fricciones de canal y desinversión), y propuesta en 5 ejes.
   - Inclusión del contrato de Joint Venture íntegro y formal (14 cláusulas) en el libro interactivo `s5`.
   - Soporte de estilos completos en `src/styles.css` para `.modal-panel`, `.info-card`, `.checklist`, `.quote`, `.book-page`, `.book-cover`, `.route-map`, etc.
   - Créditos académicos en `Welcome.tsx` para UFPS, Comercio Internacional y autoras (Paula Andrea Acevedo Carrillo y Alba Paola Alvarez Barranco).
   - Migración de clave de persistencia a `corona-falabella-stations-v2`.
5. Soporte para despliegue en Render sin reposo: script `start` en `package.json`, endpoint liviano `/health` y auto-ping cada 10 min en `src/server.ts` (usando `RENDER_EXTERNAL_URL`), más workflow opcional `.github/workflows/keep-alive.yml`.
6. Portada (`Welcome.tsx`): reemplazada imagen de fondo por `public/store-welcome.jpg` (foto fachada Homecenter Sodimac Corona) y limpieza de textos secundarios en header, hero y tarjeta lateral.
7. Portada centrada con degradado radial al centro, footer simplificado solo con los nombres de las autoras (ocultando enlace visible a `/admin`), y ajustes en `AvatarEditor.tsx` (título `¡Prepárate para ir a Homecenter!`, botón `← Volver al inicio` y botón `▶ Entrar a Homecenter`).

## Ideas pendientes (no pedidas aún)
- Afinar el aspecto del mapa (más detalle de productos, iluminación) según feedback del usuario.
- Alinear fuentes/colores del editor de avatar con el nuevo inicio **solo si el usuario lo pide**.
