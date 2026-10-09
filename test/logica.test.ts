// Pruebas para la lógica del juego "La última pupusa"
import { describe, it, expect } from 'vitest';
import {
  crearJuego,
  retirarPupusas,
  puedeRetirar,
  turnoComputadora,
  reiniciarJuego,
  cambiarModo,
  Juego,
  CONFIGURACION_POR_DEFECTO,
  ModoJuego
} from '../src/logica.js';

describe('crearJuego', () => {
  it('crea un juego con la configuración por defecto (vs computadora)', () => {
    const juego = crearJuego();
    expect(juego.pupusasRestantes).toBe(CONFIGURACION_POR_DEFECTO.pupusasIniciales);
    expect(juego.turno).toBe('humano');
    expect(juego.estado).toBe('jugando');
    expect(juego.historial).toEqual([]);
    expect(juego.configuracion).toEqual(CONFIGURACION_POR_DEFECTO);
  });

  it('crea un juego en modo dos jugadores', () => {
    const juego = crearJuego({ modo: 'dos-jugadores' });
    expect(juego.pupusasRestantes).toBe(CONFIGURACION_POR_DEFECTO.pupusasIniciales);
    expect(juego.turno).toBe('jugador1');
    expect(juego.estado).toBe('jugando');
    expect(juego.configuracion.modo).toBe('dos-jugadores');
  });

  it('permite personalizar la configuración inicial', () => {
    const juego = crearJuego({ pupusasIniciales: 20, maxRetirar: 4 });
    expect(juego.pupusasRestantes).toBe(20);
    expect(juego.configuracion.maxRetirar).toBe(4);
  });
});

describe('puedeRetirar', () => {
  it('permite retirar cantidad válida', () => {
    const juego = crearJuego({ pupusasIniciales: 10 });
    expect(puedeRetirar(juego, 1)).toBe(true);
    expect(puedeRetirar(juego, 2)).toBe(true);
    expect(puedeRetirar(juego, 3)).toBe(true);
  });

  it('rechaza retirar más de lo permitido', () => {
    const juego = crearJuego({ pupusasIniciales: 10 });
    expect(puedeRetirar(juego, 4)).toBe(false);
    expect(puedeRetirar(juego, 0)).toBe(false);
    expect(puedeRetirar(juego, -1)).toBe(false);
  });

  it('rechaza retirar más pupusas de las que quedan', () => {
    const juego = crearJuego({ pupusasIniciales: 2 });
    expect(puedeRetirar(juego, 3)).toBe(false);
  });
});

describe('retirarPupusas - modo vs computadora', () => {
  it('actualiza pupusas restantes y turno', () => {
    const juego = crearJuego({ pupusasIniciales: 10 });
    const nuevoJuego = retirarPupusas(juego, 2);
    expect(nuevoJuego.pupusasRestantes).toBe(8);
    expect(nuevoJuego.turno).toBe('computadora');
    expect(nuevoJuego.estado).toBe('jugando');
  });

  it('registra el movimiento en el historial', () => {
    const juego = crearJuego({ pupusasIniciales: 10 });
    const nuevoJuego = retirarPupusas(juego, 2);
    expect(nuevoJuego.historial).toHaveLength(1);
    expect(nuevoJuego.historial[0]).toEqual({
      jugador: 'humano',
      cantidad: 2,
      pupusasRestantes: 8
    });
  });

  it('no modifica el juego si el movimiento es inválido', () => {
    const juego = crearJuego({ pupusasIniciales: 10 });
    const nuevoJuego = retirarPupusas(juego, 5);
    expect(nuevoJuego).toBe(juego);
  });

  it('detecta victoria del humano cuando la computadora toma la última', () => {
    const juego = crearJuego({ pupusasIniciales: 1 });
    juego.turno = 'computadora';
    const nuevoJuego = retirarPupusas(juego, 1);
    expect(nuevoJuego.estado).toBe('gano-humano');
    expect(nuevoJuego.pupusasRestantes).toBe(0);
  });

  it('detecta victoria de la computadora cuando el humano toma la última', () => {
    const juego = crearJuego({ pupusasIniciales: 1 });
    const nuevoJuego = retirarPupusas(juego, 1);
    expect(nuevoJuego.estado).toBe('gano-computadora');
    expect(nuevoJuego.pupusasRestantes).toBe(0);
  });
});

describe('retirarPupusas - modo dos jugadores', () => {
  it('alterna turnos entre jugador1 y jugador2', () => {
    const juego = crearJuego({ pupusasIniciales: 10, modo: 'dos-jugadores' });
    let nuevoJuego = retirarPupusas(juego, 2);
    expect(nuevoJuego.turno).toBe('jugador2');
    expect(nuevoJuego.estado).toBe('jugando');

    nuevoJuego = retirarPupusas(nuevoJuego, 1);
    expect(nuevoJuego.turno).toBe('jugador1');
    expect(nuevoJuego.estado).toBe('jugando');
  });

  it('registra movimientos con jugador correcto', () => {
    const juego = crearJuego({ pupusasIniciales: 10, modo: 'dos-jugadores' });
    let nuevoJuego = retirarPupusas(juego, 2);
    expect(nuevoJuego.historial[0].jugador).toBe('jugador1');

    nuevoJuego = retirarPupusas(nuevoJuego, 1);
    expect(nuevoJuego.historial[1].jugador).toBe('jugador2');
  });

  it('detecta victoria del jugador2 cuando jugador1 toma la última', () => {
    const juego = crearJuego({ pupusasIniciales: 1, modo: 'dos-jugadores' });
    const nuevoJuego = retirarPupusas(juego, 1);
    expect(nuevoJuego.estado).toBe('gano-jugador2');
    expect(nuevoJuego.pupusasRestantes).toBe(0);
  });

  it('detecta victoria del jugador1 cuando jugador2 toma la última', () => {
    const juego = crearJuego({ pupusasIniciales: 1, modo: 'dos-jugadores' });
    juego.turno = 'jugador2';
    const nuevoJuego = retirarPupusas(juego, 1);
    expect(nuevoJuego.estado).toBe('gano-jugador1');
    expect(nuevoJuego.pupusasRestantes).toBe(0);
  });
});

describe('turnoComputadora', () => {
  it('devuelve un número válido entre 1 y maxRetirar', () => {
    const juego = crearJuego({ pupusasIniciales: 10 });
    const cantidad = turnoComputadora(juego);
    expect(cantidad).toBeGreaterThanOrEqual(1);
    expect(cantidad).toBeLessThanOrEqual(juego.configuracion.maxRetirar);
  });

  it('no devuelve más pupusas de las que quedan', () => {
    const juego = crearJuego({ pupusasIniciales: 2 });
    const cantidad = turnoComputadora(juego);
    expect(cantidad).toBeLessThanOrEqual(2);
  });
});

describe('reiniciarJuego', () => {
  it('restablece el juego manteniendo la configuración', () => {
    const juego = crearJuego({ pupusasIniciales: 15, maxRetirar: 3 });
    juego.pupusasRestantes = 5;
    juego.turno = 'computadora';
    juego.estado = 'gano-humano';
    juego.historial = [{ jugador: 'humano', cantidad: 2, pupusasRestantes: 5 }];

    const reiniciado = reiniciarJuego(juego);
    expect(reiniciado.pupusasRestantes).toBe(15);
    expect(reiniciado.turno).toBe('humano');
    expect(reiniciado.estado).toBe('jugando');
    expect(reiniciado.historial).toEqual([]);
    expect(reiniciado.configuracion).toEqual(juego.configuracion);
  });

  it('restablece modo dos jugadores correctamente', () => {
    const juego = crearJuego({ pupusasIniciales: 15, maxRetirar: 3, modo: 'dos-jugadores' });
    juego.pupusasRestantes = 5;
    juego.turno = 'jugador2';
    juego.estado = 'gano-jugador1';
    juego.historial = [{ jugador: 'jugador1', cantidad: 2, pupusasRestantes: 5 }];

    const reiniciado = reiniciarJuego(juego);
    expect(reiniciado.pupusasRestantes).toBe(15);
    expect(reiniciado.turno).toBe('jugador1');
    expect(reiniciado.estado).toBe('jugando');
    expect(reiniciado.historial).toEqual([]);
    expect(reiniciado.configuracion.modo).toBe('dos-jugadores');
  });
});

describe('partida completa de principio a fin', () => {
  it('se puede llegar al final bueno jugando una partida completa contra la computadora', () => {
    let juego = crearJuego({ pupusasIniciales: 12, maxRetirar: 3, modo: 'vs-computadora' });
    const max = juego.configuracion.maxRetirar;
    let pasos = 0;

    while (juego.estado === 'jugando' && pasos < 50) {
      pasos++;
      if (juego.turno === 'humano') {
        // El humano juega óptimo: intenta dejar 1, 5 o 9 pupusas
        const restantes = juego.pupusasRestantes;
        const objetivo = (restantes - 1) % (max + 1);
        const cantidad = (objetivo >= 1 && objetivo <= max) ? objetivo : 1;
        juego = retirarPupusas(juego, cantidad);
      } else {
        juego = retirarPupusas(juego, turnoComputadora(juego));
      }
    }

    expect(juego.estado).toBe('gano-humano');
    expect(juego.pupusasRestantes).toBe(0);
    expect(juego.historial.length).toBeGreaterThan(0);
  });

  it('se puede llegar al final bueno en una partida completa entre dos jugadores', () => {
    let juego = crearJuego({ pupusasIniciales: 12, maxRetirar: 3, modo: 'dos-jugadores' });

    juego = retirarPupusas(juego, 3); // J1: quedan 9
    expect(juego.turno).toBe('jugador2');
    juego = retirarPupusas(juego, 3); // J2: quedan 6
    expect(juego.turno).toBe('jugador1');
    juego = retirarPupusas(juego, 3); // J1: quedan 3
    expect(juego.turno).toBe('jugador2');
    juego = retirarPupusas(juego, 3); // J2 toma la última y pierde

    expect(juego.pupusasRestantes).toBe(0);
    expect(juego.estado).toBe('gano-jugador1');
    expect(juego.historial).toHaveLength(4);
  });
});

describe('cambiarModo', () => {
  it('cambia de vs-computadora a dos-jugadores', () => {
    const juego = crearJuego({ pupusasIniciales: 10, modo: 'vs-computadora' });
    juego.pupusasRestantes = 5;
    juego.turno = 'computadora';
    juego.historial = [{ jugador: 'humano', cantidad: 2, pupusasRestantes: 5 }];

    const nuevoJuego = cambiarModo(juego, 'dos-jugadores');
    expect(nuevoJuego.configuracion.modo).toBe('dos-jugadores');
    expect(nuevoJuego.pupusasRestantes).toBe(10); // Se reinicia
    expect(nuevoJuego.turno).toBe('jugador1');
    expect(nuevoJuego.historial).toEqual([]);
  });

  it('cambia de dos-jugadores a vs-computadora', () => {
    const juego = crearJuego({ pupusasIniciales: 10, modo: 'dos-jugadores' });
    juego.pupusasRestantes = 5;
    juego.turno = 'jugador2';
    juego.historial = [{ jugador: 'jugador1', cantidad: 2, pupusasRestantes: 5 }];

    const nuevoJuego = cambiarModo(juego, 'vs-computadora');
    expect(nuevoJuego.configuracion.modo).toBe('vs-computadora');
    expect(nuevoJuego.pupusasRestantes).toBe(10);
    expect(nuevoJuego.turno).toBe('humano');
    expect(nuevoJuego.historial).toEqual([]);
  });
});