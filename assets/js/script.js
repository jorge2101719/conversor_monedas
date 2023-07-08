let pesos = document.querySelector('#pesos');
let moneda = document.querySelector('#monedaSeleccionada');
let buscar = document.querySelector('#buscar');
let limpiar = document.querySelector('#limpiar');
let resultado = 0;
let calculo = document.querySelector('#calculo');

const urlIndicadores = 'https://mindicador.cl/api';


buscar.addEventListener('click', () => {
    let monto = Number(pesos.value);
    console.log(monto);
    if (monto == isNaN) {
        alert('El dato es incorrecto. Ingrese un número');
    } else {
        getValores();
        getAndCreateDataToChart();
    }
});

limpiar.addEventListener('click', () => {
    limpiarCampos();
})

async function getValores() {
    const res = await fetch(urlIndicadores);
    const valores = await res.json();
    // console.log('petición hecha', valores);
    const miListaDeValores = [valores['uf']['valor'], valores['dolar']['valor'], valores['euro']['valor']];
    // console.log('esta es mi lista de valores', miListaDeValores);
    if (moneda.value == '' || Number(moneda.value) == isNaN) {
        alert('Valor incorrecto. Por favor, ingrese un valor positivo');
    } else if (moneda.value == 'uf') {
        resultado = pesos.value/miListaDeValores[0];
        calculo.innerHTML = `${resultado.toFixed(4)} UF`;
    } else if (moneda.value == 'dolar') {
        resultado = pesos.value/miListaDeValores[1];
        calculo.innerHTML = `US $ ${resultado.toFixed(2)}`;
    } else if (moneda.value == 'euro') {
        resultado = pesos.value/miListaDeValores[2];
        calculo.innerHTML = `&euro; ${resultado.toFixed(2)}`
    }
}

function limpiarCampos(){
    pesos.value = '';
    moneda.value = '';
}

// 

async function getAndCreateDataToChart() {
    const res = await fetch(urlIndicadores);
    const data = await res.json();
    console.log('petición para graficar', data);
}

// getAndCreateDataToChart();