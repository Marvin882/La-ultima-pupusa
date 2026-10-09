# La última pupusa

Juego de estrategia para una persona contra la computadora, inspirado en el juego de Nim. Quien retire la última pupusa **pierde**.

## Cómo jugar

1. **Elige el modo** en el selector superior: *Contra la computadora* o *Dos jugadores*.
2. Hay un plato con pupusas (12 por defecto).
3. En tu turno, retira **1, 2 o 3 pupusas** (botones abajo).
4. En modo *contra la computadora*, luego juega la IA. En modo *dos jugadores*, el turno alterna entre Jugador 1 y Jugador 2.
5. Quien se vea obligado a tomar la **última pupusa pierde**.
6. Usa el botón **Reiniciar partida** para volver a empezar.

La computadora juega con estrategia óptima: intenta dejarte en posiciones perdedoras (múltiplos de 4 + 1).

## Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo (servidor local con recarga en caliente)
npm run dev

# Ejecutar pruebas
npm test

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Enlace público

🔗 https://marvin882.github.io/La-ultima-pupusa/

*(Se publica automáticamente desde la rama `gh-pages` tras push a `master` — **verificado funcionando**)*

---

## Estructura del proyecto

```
├── index.html          # HTML principal
├── src/
│   ├── logica.ts       # Reglas, tipos y estrategia (separada de la UI)
│   ├── main.ts         # Conecta lógica con interfaz
│   └── estilo.css      # Estilos visuales (tema pupusería)
├── test/
│   └── logica.test.ts  # Pruebas automatizadas (21 tests)
├── package.json
├── tsconfig.json
└── .gitignore
```

## Tecnologías

- TypeScript (estricto)
- Vite (dev server + build)
- Vitest (pruebas)
- CSS moderno (variables, clamp, grid/flex, animaciones)

---

## Qué dirigí

_[Completar: decisiones de diseño, arquitectura, enfoque...]_

## Qué error encontré y cómo lo resolví

_[Completar: bug específico, causa, solución...]_

## Declaración de autoría

Yo, **Marvin882**, declaro que este proyecto es mi trabajo original, desarrollado como parte de la práctica 19, siguiendo las etapas y commits requeridos.

---

*Proyecto educativo — Práctica 19 — "La última pupusa"*