// Lógica del juego "La última pupusa"
// Por implementar según la ficha del proyecto

export type Jugador = 'humano' | 'computadora';

export type EstadoJuego = 'jugando' | 'gano-humano' | 'gano-computadora';

export interface Movimiento {
  jugador: Jugador;
  cantidad: number;
  pupusasRestantes: number;
}

export interface ConfiguracionJuego {
  pupusasIniciales: number;
  maxRetirar: number;
}

export const CONFIGURACION_POR_DEFECTO: ConfiguracionJuego = {
  pupusasIniciales: 12,
  maxRetirar: 3
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
  return {
    pupusasRestantes: configuracion.pupusasIniciales,
    turno: 'humano',
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
  let siguienteTurno: Jugador = juego.turno === 'humano' ? 'computadora' : 'humano';

  if (nuevasPupusas === 0) {
    // Quien retira la última pierde
    nuevoEstado = juego.turno === 'humano' ? 'gano-computadora' : 'gano-humano';
    siguienteTurno = juego.turno;
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