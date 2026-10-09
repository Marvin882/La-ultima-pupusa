// Lógica del juego "La última pupusa"

export type ModoJuego = 'vs-computadora' | 'dos-jugadores';

export type Jugador = 'humano' | 'computadora' | 'jugador1' | 'jugador2';

export type EstadoJuego = 'jugando' | 'gano-humano' | 'gano-computadora' | 'gano-jugador1' | 'gano-jugador2';

export interface Movimiento {
  jugador: Jugador;
  cantidad: number;
  pupusasRestantes: number;
}

export interface ConfiguracionJuego {
  pupusasIniciales: number;
  maxRetirar: number;
  modo: ModoJuego;
}

export const CONFIGURACION_POR_DEFECTO: ConfiguracionJuego = {
  pupusasIniciales: 12,
  maxRetirar: 3,
  modo: 'vs-computadora'
};

export interface Juego {
  pupusasRestantes: number;
  turno: Jugador;
  estado: EstadoJuego;
  historial: Movimiento[];
  configuracion: ConfiguracionJuego;
}

export function crearJuego(config?: Partial<ConfiguracionJuego>): Juego {
  const configuracion = { ...CONFIGURACION_POR_DEFECTO, ...config };
  const turnoInicial = configuracion.modo === 'dos-jugadores' ? 'jugador1' : 'humano';
  return {
    pupusasRestantes: configuracion.pupusasIniciales,
    turno: turnoInicial,
    estado: 'jugando',
    historial: [],
    configuracion
  };
}

export function puedeRetirar(juego: Juego, cantidad: number): boolean {
  return cantidad >= 1 && cantidad <= juego.configuracion.maxRetirar && cantidad <= juego.pupusasRestantes;
}

export function retirarPupusas(juego: Juego, cantidad: number): Juego {
  if (!puedeRetirar(juego, cantidad)) {
    return juego;
  }

  const nuevasPupusas = juego.pupusasRestantes - cantidad;
  const movimiento: Movimiento = {
    jugador: juego.turno,
    cantidad,
    pupusasRestantes: nuevasPupusas
  };

  let nuevoEstado: EstadoJuego = 'jugando';
  let siguienteTurno: Jugador = juego.turno;

  if (nuevasPupusas === 0) {
    // Quien retira la última pierde
    switch (juego.turno) {
      case 'humano':
        nuevoEstado = 'gano-computadora';
        break;
      case 'computadora':
        nuevoEstado = 'gano-humano';
        break;
      case 'jugador1':
        nuevoEstado = 'gano-jugador2';
        break;
      case 'jugador2':
        nuevoEstado = 'gano-jugador1';
        break;
    }
    siguienteTurno = juego.turno;
  } else {
    // Cambiar turno según el modo
    if (juego.configuracion.modo === 'dos-jugadores') {
      siguienteTurno = juego.turno === 'jugador1' ? 'jugador2' : 'jugador1';
    } else {
      siguienteTurno = juego.turno === 'humano' ? 'computadora' : 'humano';
    }
  }

  return {
    ...juego,
    pupusasRestantes: nuevasPupusas,
    turno: siguienteTurno,
    estado: nuevoEstado,
    historial: [...juego.historial, movimiento]
  };
}

export function turnoComputadora(juego: Juego): number {
  // Estrategia: dejar múltiplos de (maxRetirar + 1) + 1 al oponente
  // En este juego quien toma la última pierde, así que la estrategia es distinta
  const max = juego.configuracion.maxRetirar;
  const restantes = juego.pupusasRestantes;

  // Posiciones ganadoras: 1, max+2, 2*(max+1)+1, ...
  // La computadora intenta dejar al humano en una posición perdedora
  const objetivo = (restantes - 1) % (max + 1);

  if (objetivo >= 1 && objetivo <= max) {
    return objetivo;
  }

  // Si no hay movimiento ganador, tomar 1 (o lo que se pueda)
  return Math.min(1, restantes);
}

export function reiniciarJuego(juego: Juego): Juego {
  return crearJuego(juego.configuracion);
}

export function cambiarModo(juego: Juego, modo: ModoJuego): Juego {
  const nuevaConfig = { ...juego.configuracion, modo };
  return crearJuego(nuevaConfig);
}