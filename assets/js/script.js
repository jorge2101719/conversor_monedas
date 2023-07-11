let pesos = document.querySelector('#pesos');
let moneda = document.querySelector('#monedaSeleccionada');
let buscar = document.querySelector('#buscar');
let limpiar = document.querySelector('#limpiar');
let resultado = 0;
let calculo = document.querySelector('#calculo');
let mensaje = document.querySelector('#mensaje');
let grafico = document.querySelector('#grafico');
let miGrafico = document.querySelector('#miGrafico');
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
    }
});

limpiar.addEventListener('click', () => {
    limpiarCampos();
})

async function getValores() {
    try{
        const res = await fetch(urlIndicadores);
        const valores = await res.json();
        // 
        const miListaDeValores = [valores.uf.valor, valores.dolar.valor, valores.euro.valor];
        mensaje.innerHTML = `$${pesos.value} equivalen a: `;
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
    let res = await fetch(urlIndicadores + tipo_indicador);
    let valoresIndicador = await res.json();

    let labels = valoresIndicador.serie.slice(0,10).reverse().map((fechaDelDia) => {
        return fechaDelDia.fecha.slice(0,10).split('-').reverse().join('-');
    });

    let data = valoresIndicador.serie.slice(0,10).reverse().map((valorDelDia) => {
        return Number(valorDelDia.valor);
    });

    let datasets = [
        {
            label: `Valor ${tipo_indicador} últimos 10 días`,
            borderColor: 'rgb(54, 162, 235)',
            data
        }
    ];
    return {labels, datasets}
}

async function renderGrafica(indicador) {
    let data = await getAndCreateDataToChart(indicador);
    let config = {
        type: 'line',
        data
    };

    // Los gráficos se dibujan en diferentes espacios,
    // pues puede haber un cliente que desee apreciar más de uno en una consulta
    if(indicador == 'uf') {
        dibuno.style.backgroundColor = 'white';
        new Chart(dibuno, config);
    } else if(indicador == 'dolar') {
        dibdos.style.backgroundColor = 'white';
        new Chart(dibdos, config);
    } else if(indicador == 'euro') {
        dibtres.style.backgroundColor = 'white';
        new Chart(dibtres, config);

    }
}