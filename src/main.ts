// Punto de entrada - conecta la lógica con la interfaz
import './estilo.css';
import { 
  crearJuego, 
  retirarPupusas, 
  puedeRetirar,
  turnoComputadora, 
  reiniciarJuego, 
  cambiarModo,
  Juego, 
  ModoJuego 
} from './logica.js';

let juego: Juego = crearJuego();

const pupusasDisplay = document.getElementById('pupusas-restantes') as HTMLElement;
const turnoDisplay = document.getElementById('turno-actual') as HTMLElement;
const mensajeDisplay = document.getElementById('mensaje') as HTMLElement;
const historialDisplay = document.getElementById('historial') as HTMLElement;
const btn1 = document.getElementById('btn-1') as HTMLButtonElement;
const btn2 = document.getElementById('btn-2') as HTMLButtonElement;
const btn3 = document.getElementById('btn-3') as HTMLButtonElement;
const btnReiniciar = document.getElementById('btn-reiniciar') as HTMLButtonElement;
const plato = document.getElementById('plato') as HTMLElement;
const modoSelector = document.getElementById('modo-juego') as HTMLSelectElement;

function actualizarVista(): void {
  pupusasDisplay.textContent = juego.pupusasRestantes.toString();
  
  // Actualizar indicador de turno según modo
  actualizarIndicadorTurno();
  
  // Actualizar botones
  const esTurnoHumanoActivo = esTurnoActivoHumano();
  btn1.disabled = !puedeRetirar(juego, 1) || juego.estado !== 'jugando' || !esTurnoHumanoActivo;
  btn2.disabled = !puedeRetirar(juego, 2) || juego.estado !== 'jugando' || !esTurnoHumanoActivo;
  btn3.disabled = !puedeRetirar(juego, 3) || juego.estado !== 'jugando' || !esTurnoHumanoActivo;

  // Dibujar pupusas en el plato
  dibujarPupusas();

  // Mostrar mensaje de fin de partida
  actualizarMensaje();

  // Actualizar historial
  actualizarHistorial();
}

function esTurnoActivoHumano(): boolean {
  if (juego.configuracion.modo === 'dos-jugadores') {
    return juego.turno === 'jugador1' || juego.turno === 'jugador2';
  }
  return juego.turno === 'humano';
}

function actualizarIndicadorTurno(): void {
  if (juego.configuracion.modo === 'dos-jugadores') {
    turnoDisplay.textContent = juego.turno === 'jugador1' ? 'Turno del Jugador 1' : 'Turno del Jugador 2';
    turnoDisplay.className = juego.turno === 'jugador1' ? 'turno-jugador1' : 'turno-jugador2';
  } else {
    turnoDisplay.textContent = juego.turno === 'humano' ? 'Tu turno' : 'Turno de la computadora';
    turnoDisplay.className = juego.turno === 'humano' ? 'turno-humano' : 'turno-computadora';
  }
}

function dibujarPupusas(): void {
  plato.innerHTML = '';
  for (let i = 0; i < juego.pupusasRestantes; i++) {
    const pupusa = document.createElement('div');
    pupusa.className = 'pupusa';
    pupusa.style.setProperty('--i', i.toString());
    plato.appendChild(pupusa);
  }
}

function actualizarMensaje(): void {
  if (juego.estado === 'gano-humano') {
    mensajeDisplay.textContent = '¡Ganaste! La computadora tomó la última pupusa.';
    mensajeDisplay.className = 'mensaje victoria';
  } else if (juego.estado === 'gano-computadora') {
    mensajeDisplay.textContent = 'La computadora ganó. Tú tomaste la última pupusa.';
    mensajeDisplay.className = 'mensaje derrota';
  } else if (juego.estado === 'gano-jugador1') {
    mensajeDisplay.textContent = '¡Jugador 1 ganó! Jugador 2 tomó la última pupusa.';
    mensajeDisplay.className = 'mensaje victoria';
  } else if (juego.estado === 'gano-jugador2') {
    mensajeDisplay.textContent = '¡Jugador 2 ganó! Jugador 1 tomó la última pupusa.';
    mensajeDisplay.className = 'mensaje victoria';
  } else {
    mensajeDisplay.textContent = '';
    mensajeDisplay.className = 'mensaje';
  }
}

function actualizarHistorial(): void {
  historialDisplay.innerHTML = '';
  juego.historial.forEach((mov, index) => {
    const item = document.createElement('div');
    item.className = 'historial-item';
    let jugadorTexto = '';
    switch (mov.jugador) {
      case 'humano': jugadorTexto = 'Tú'; break;
      case 'computadora': jugadorTexto = 'Computadora'; break;
      case 'jugador1': jugadorTexto = 'Jugador 1'; break;
      case 'jugador2': jugadorTexto = 'Jugador 2'; break;
    }
    item.textContent = `${index + 1}. ${jugadorTexto} retiró ${mov.cantidad} pupusa${mov.cantidad > 1 ? 's' : ''} (quedan ${mov.pupusasRestantes})`;
    historialDisplay.appendChild(item);
  });
  historialDisplay.scrollTop = historialDisplay.scrollHeight;
}

async function manejarTurnoHumano(cantidad: number): Promise<void> {
  if (juego.estado !== 'jugando') return;
  if (!esTurnoActivoHumano()) return;
  if (!puedeRetirar(juego, cantidad)) return;

  juego = retirarPupusas(juego, cantidad);
  actualizarVista();

  // En modo vs computadora, jugar turno de la IA
  if (juego.estado === 'jugando' && juego.configuracion.modo === 'vs-computadora' && juego.turno === 'computadora') {
    await new Promise(r => setTimeout(r, 500));
    const cantidadComputadora = turnoComputadora(juego);
    juego = retirarPupusas(juego, cantidadComputadora);
    actualizarVista();
  }
  // En modo dos jugadores, solo actualizar vista (turno cambia automáticamente)
}

function manejarReiniciar(): void {
  juego = reiniciarJuego(juego);
  actualizarVista();
}

function manejarCambioModo(): void {
  const nuevoModo = modoSelector.value as ModoJuego;
  juego = cambiarModo(juego, nuevoModo);
  actualizarVista();
}

// Event listeners
btn1.addEventListener('click', () => manejarTurnoHumano(1));
btn2.addEventListener('click', () => manejarTurnoHumano(2));
btn3.addEventListener('click', () => manejarTurnoHumano(3));
btnReiniciar.addEventListener('click', manejarReiniciar);
modoSelector.addEventListener('change', manejarCambioModo);

// Inicializar
actualizarVista();