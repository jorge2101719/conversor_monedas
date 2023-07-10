let pesos = document.querySelector('#pesos');
let moneda = document.querySelector('#monedaSeleccionada');
let buscar = document.querySelector('#buscar');
let limpiar = document.querySelector('#limpiar');
let resultado = 0;
let calculo = document.querySelector('#calculo');
let info = document.querySelector('#info');
let grafico = document.querySelector('#grafico');
let dibuno = document.querySelector('#dibuno');
let dibdos = document.querySelector('#dibdos');
let dibtres = document.querySelector('#dibtres');

const urlIndicadores = 'https://mindicador.cl/api/';

buscar.addEventListener('click', () => {
    if (pesos.value == '' || Number(pesos.value) < 0) {
        alert('La cantidad es icorrecta. Por favor, ingrese un valor positivo');
    } else if (moneda.value == '') {
        alert("Por favor seleccione una moneda");
    } else {
        getValores();
        info.innerHTML = `El gráfico aparece más abajo (${moneda.value})`;
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
        if (moneda.value == 'uf') {
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
}

// --------------------------------------------------------

async function getAndCreateDataToChart(tipo_indicador) {
    const res = await fetch(urlIndicadores + tipo_indicador);
    const valoresIndicador = await res.json();

    const labels = valoresIndicador['serie'].slice(0,10).reverse().map((fechaDelDia) => {
        return fechaDelDia['fecha'].slice(0,10).split('-').reverse().join('-');
    });

    const data = valoresIndicador['serie'].slice(0,10).reverse().map((valorDelDia) => {
        return Number(valorDelDia['valor']);
    });

    const datasets = [
        {
            label: `Valor ${tipo_indicador} últimos 10 días`,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'white',
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

    if(indicador == 'uf') {
        dibuno.style.backgroundColor = 'white';
        new Chart(dibuno, config);
    } else if(indicador == 'dolar') {
        dibdos.style.backgroundColor = 'lightblue';
        new Chart(dibdos, config);
    } else if(indicador == 'euro') {
        dibtres.style.backgroundColor = 'lightyellow';
        new Chart(dibtres, config)
    }
    // new Chart(dibuno, config);
}