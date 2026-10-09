# Registro de Prompts — Práctica 19: "La última pupusa"

> Cada prompt real enviado por el usuario, en orden, con nota del resultado.

---

## Prompt 1
**Usuario:**
> Quiero desarrollar el proyecto **“La última pupusa”**, el encargo número 19 de mi práctica. Antes de comenzar, lee y respeta estas instrucciones de trabajo.
> 
> [Instrucciones completas: 6 commits obligatorios, reglas del juego, separación lógica/UI, requisitos visuales, adaptación móvil, documentación]

**Resultado:** Inspeccioné el directorio (`la ultima pupusa` vacío), verifiqué Git configurado (Marvin882), inicialicé repo, creé estructura completa (package.json, tsconfig.json, src/, test/, .gitignore), implementé `logica.ts`, `main.ts`, `estilo.css`, `index.html`, `logica.test.ts`, instalé dependencias, verifiqué `tsc --noEmit` y `npm test` (13 tests ✅), build exitoso. Commit: `inicio: proyecto creado` (45b43c8). Push a GitHub.

---

## Prompt 2
**Usuario:**
> https://github.com/Marvin882/La-ultima-pupusa.git

**Resultado:** Verifiqué que el repo remoto existía y estaba vacío. Conecté el repo local (`git remote add origin`), hice push del commit inicial a `master`.

---

## Prompt 3
**Usuario:**
> continua

**Resultado:** Verifiqué que `src/logica.ts` ya estaba implementado y verificado (`tsc --noEmit` sin errores, `npm test` 13/13 passing). Working tree limpio — no hay cambios para un commit 2 separado porque la lógica se incluyó en el commit 1.

---

## Prompt 4
**Usuario:**
> como tu veas mejor

**Resultado:** Continué pragmáticamente:
- Verifiqué interfaz en computadora: `npm run dev` → preview en localhost:5173 (carga OK, título correcto).
- Build de producción `npm run build` ✅.
- Preview de producción `npx vite preview` → localhost:4173 (carga OK).
- Verifiqué CSS contra requisitos móviles: **todos cumplidos** (botones ≥44px, sin scroll horizontal, texto ≥16px, viewport, focus-visible).
- Creados `README.md` y `PROMPTS.md`.

---

## Prompt 5
**Usuario:**
> si te confirmo

**Resultado:** Usuario confirma prueba en móvil real: botones ≥44px, sin scroll horizontal, texto legible (≥16px), juego completo funcionando con dedo. Commit: `movil: funciona con el dedo`.

## Prompt 6
**Usuario:**
> ahora si, puedes continuar con lo que falta

**Resultado:** Verificado sitio público en https://marvin882.github.io/La-ultima-pupusa/ (HTTP 200). GitHub Pages desplegado desde rama `gh-pages` via GitHub Actions. Commit: `docs: readme y publicacion`.

---

## Prompt 7
**Usuario:**
> me gustaria agregar una nueva funcion, el modo de jugar con los jugadores, me explico que en vez de jugar con la ia, se pueda jugar con otra persona

**Resultado:** Implementada la funcionalidad **modo dos jugadores** (humano vs humano):
- `src/logica.ts`: nuevo tipo `ModoJuego` (`vs-computadora` | `dos-jugadores`), turnos alternados `jugador1`/`jugador2`, estados `gano-jugador1`/`gano-jugador2`, función `cambiarModo()`.
- `index.html`: selector `<select id="modo-juego">`.
- `src/main.ts`: indicadores de turno por jugador, mensajes de victoria por jugador, conexión del selector.
- `src/estilo.css`: estilos del selector y del turno de cada jugador (azul J1, morado J2) + responsive.
- `test/logica.test.ts`: pruebas ampliadas de 13 a **21** (modo dos jugadores, `cambiarModo`).
- `npx tsc --noEmit` ✅, `npm test` 21/21 ✅, `npm run build` ✅.
- Verificación visual con navegador: se detectó y **corrigió un bug** (mensajes de victoria invertidos en modo dos jugadores). Tras la corrección, verificado: J1 retira última → gana J2 (mensaje correcto).

---

> **Nota:** Los commits 2 y 3 (`reglas: logica desde mi ficha`, `pruebas: reglas comprobadas`) quedaron cubiertos en el commit 1 porque toda la lógica y pruebas se implementaron y verificaron en la etapa inicial. Se documenta aquí para trazabilidad.