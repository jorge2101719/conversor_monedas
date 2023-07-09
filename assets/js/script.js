let pesos = document.querySelector('#pesos');
let moneda = document.querySelector('#monedaSeleccionada');
let buscar = document.querySelector('#buscar');
let limpiar = document.querySelector('#limpiar');
let resultado = 0;
let calculo = document.querySelector('#calculo');
let grafico = document.querySelector('#grafico');
let myChart = document.querySelector('#myChart');

const urlIndicadores = 'https://mindicador.cl/api/';

buscar.addEventListener('click', () => {
    let monto = Number(pesos.value);
    if (monto == isNaN) {
        alert('El dato es incorrecto. Ingrese un número');
    } else {
        getValores();
    }
});

limpiar.addEventListener('click', () => {
    limpiarCampos();
})

async function getValores() {
    try{
        const res = await fetch(urlIndicadores);
        const valores = await res.json();
        const miListaDeValores = [valores['uf']['valor'], valores['dolar']['valor'], valores['euro']['valor']];
        if (moneda.value == '' || Number(moneda.value) == isNaN) {
            alert('Valor incorrecto. Por favor, ingrese un valor positivo');
        } else if (moneda.value == 'uf') {
            resultado = pesos.value/miListaDeValores[0];
            calculo.innerHTML = `${resultado.toFixed(4).replace('.', ',')} UF`;
            renderGrafica('uf');
        } else if (moneda.value == 'dolar') {
            resultado = pesos.value/miListaDeValores[1];
            calculo.innerHTML = `US $ ${resultado.toFixed(2).replace('.', ',')}`;
            renderGrafica('dolar');
        } else if (moneda.value == 'euro') {
            resultado = pesos.value/miListaDeValores[2];
            calculo.innerHTML = `&euro; ${resultado.toFixed(2).replace('.', ',')}`;
            renderGrafica('euro');
        }
    } catch(e) {
        alert(e.message)
    } finally {
       console.log('Ha finalizado su petición...');
    }
}

function limpiarCampos(){
    pesos.value = '';
    moneda.value = '';
    calculo.innerHTML = '...';
    // myChart.innerHTML = new Chart();
    // grafico.style.width = 0;
    // grafico.style.height = 0;
    // myChart.style.width = 0;
    // myChart.style.height = 0;
}

// --------------------------------------------------------

async function getAndCreateDataToChart(tipo_indicador) {
    const res = await fetch(urlIndicadores + tipo_indicador);
    const valoresIndicador = await res.json();

    const labels = valoresIndicador['serie'].slice(0,10).reverse().map((fechaDelDia) => {
        // console.log(fechaDelDia.fecha.slice(0,10).split('-').reverse().join('-'));
        return fechaDelDia['fecha'].slice(0,10).split('-').reverse().join('-');
    });

    const data = valoresIndicador['serie'].slice(0,10).reverse().map((valorDelDia) => {
        return Number(valorDelDia['valor']);
    });

    const datasets = [
        {
            label: `Valor ${tipo_indicador} últimos 10 días`,
            borderColor: 'rgb(255, 99, 132)',
            data
        }
    ];
    return {labels, datasets}
}

async function renderGrafica(indicador) {
    const data = await getAndCreateDataToChart(indicador);
    const config = {
        type: 'line',
        data
    };
    // myChart = document.querySelector('#myChart');
    myChart.style.backgroundColor = 'white';
    myChart.innerHTML = new Chart(myChart, config);
}