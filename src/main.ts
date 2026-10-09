// Punto de entrada - conecta la lógica con la interfaz
import { crearJuego, retirarPupusas, turnoComputadora, reiniciarJuego, Juego, Jugador } from './logica.js';

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

function actualizarVista(): void {
  pupusasDisplay.textContent = juego.pupusasRestantes.toString();
  turnoDisplay.textContent = juego.turno === 'humano' ? 'Tu turno' : 'Turno de la computadora';
  turnoDisplay.className = juego.turno === 'humano' ? 'turno-humano' : 'turno-computadora';

  // Actualizar botones
  btn1.disabled = !puedeRetirar(1) || juego.estado !== 'jugando' || juego.turno !== 'humano';
  btn2.disabled = !puedeRetirar(2) || juego.estado !== 'jugando' || juego.turno !== 'humano';
  btn3.disabled = !puedeRetirar(3) || juego.estado !== 'jugando' || juego.turno !== 'humano';

  // Dibujar pupusas en el plato
  dibujarPupusas();

  // Mostrar mensaje de fin de partida
  if (juego.estado === 'gano-humano') {
    mensajeDisplay.textContent = '¡Ganaste! La computadora tomó la última pupusa.';
    mensajeDisplay.className = 'mensaje victoria';
  } else if (juego.estado === 'gano-computadora') {
    mensajeDisplay.textContent = 'La computadora ganó. Tú tomaste la última pupusa.';
    mensajeDisplay.className = 'mensaje derrota';
  } else {
    mensajeDisplay.textContent = '';
    mensajeDisplay.className = 'mensaje';
  }

  // Actualizar historial
  actualizarHistorial();
}

function puedeRetirar(cantidad: number): boolean {
  return cantidad >= 1 && cantidad <= juego.configuracion.maxRetirar && cantidad <= juego.pupusasRestantes;
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

function actualizarHistorial(): void {
  historialDisplay.innerHTML = '';
  juego.historial.forEach((mov, index) => {
    const item = document.createElement('div');
    item.className = 'historial-item';
    const jugadorTexto = mov.jugador === 'humano' ? 'Tú' : 'Computadora';
    item.textContent = `${index + 1}. ${jugadorTexto} retiró ${mov.cantidad} pupusa${mov.cantidad > 1 ? 's' : ''} (quedan ${mov.pupusasRestantes})`;
    historialDisplay.appendChild(item);
  });
  historialDisplay.scrollTop = historialDisplay.scrollHeight;
}

async function manejarTurnoHumano(cantidad: number): Promise<void> {
  if (juego.estado !== 'jugando' || juego.turno !== 'humano') return;
  if (!puedeRetirar(cantidad)) return;

  juego = retirarPupusas(juego, cantidad);
  actualizarVista();

  if (juego.estado === 'jugando' && juego.turno === 'computadora') {
    // Pequeña pausa para que se vea el movimiento
    await new Promise(r => setTimeout(r, 500));
    const cantidadComputadora = turnoComputadora(juego);
    juego = retirarPupusas(juego, cantidadComputadora);
    actualizarVista();
  }
}

function manejarReiniciar(): void {
  juego = reiniciarJuego(juego);
  actualizarVista();
}

// Event listeners
btn1.addEventListener('click', () => manejarTurnoHumano(1));
btn2.addEventListener('click', () => manejarTurnoHumano(2));
btn3.addEventListener('click', () => manejarTurnoHumano(3));
btnReiniciar.addEventListener('click', manejarReiniciar);

// Inicializar
actualizarVista();