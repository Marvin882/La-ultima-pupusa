// Pruebas para la lógica del juego "La última pupusa"
import { describe, it, expect } from 'vitest';
import {
  crearJuego,
  retirarPupusas,
  puedeRetirar,
  turnoComputadora,
  reiniciarJuego,
  Juego,
  CONFIGURACION_POR_DEFECTO
} from '../src/logica.js';

describe('crearJuego', () => {
  it('crea un juego con la configuración por defecto', () => {
    const juego = crearJuego();
    expect(juego.pupusasRestantes).toBe(CONFIGURACION_POR_DEFECTO.pupusasIniciales);
    expect(juego.turno).toBe('humano');
    expect(juego.estado).toBe('jugando');
    expect(juego.historial).toEqual([]);
    expect(juego.configuracion).toEqual(CONFIGURACION_POR_DEFECTO);
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

describe('retirarPupusas', () => {
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
});