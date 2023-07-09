let pesos = document.querySelector('#pesos');
let moneda = document.querySelector('#monedaSeleccionada');
let buscar = document.querySelector('#buscar');
let limpiar = document.querySelector('#limpiar');
let resultado = 0;
let calculo = document.querySelector('#calculo');

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
            getAndCreateDataToChart('uf');
            // renderGrafica('uf');
        } else if (moneda.value == 'dolar') {
            resultado = pesos.value/miListaDeValores[1];
            calculo.innerHTML = `US $ ${resultado.toFixed(2).replace('.', ',')}`;
            // renderGrafica('dolar');
        } else if (moneda.value == 'euro') {
            resultado = pesos.value/miListaDeValores[2];
            calculo.innerHTML = `&euro; ${resultado.toFixed(2).replace('.', ',')}`;
            // renderGrafica('euro');
        }
    } catch(e) {
        alert(e.message)
    }// finally {
       // console.log('Ha finalizado su petición...');
    //}
}

function limpiarCampos(){
    pesos.value = '';
    moneda.value = '';
}

// --------------------------------------------------------

async function getAndCreateDataToChart(tipo_indicador) {
    const res = await fetch(urlIndicadores + tipo_indicador);
    const valoresIndicador = await res.json();
    // console.log('petición para graficar', valoresIndicador['serie']);

    const labels = valoresIndicador['serie'].map((valorDelDia) => {
        // console.log(`el valor de la uf el día ${valorDelDia.fecha} fue de ${valorDelDia.valor}`);
        return valorDelDia['fecha'];
    });
    console.log(labels);

    const data = valoresIndicador['serie'].map((valorDelDia) => {
        return Number(valorDelDia['valor']);
    });
    console.log(data);

    const datasets = [
        {
            label: `${indicador}`,
            borderColor: rgb(255, 99, 132),
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

    const myChart = document.querySelector('#myChart');
    myChart.style.backgroundColor = 'white';
    new Chart(myChart, config);
}

// renderGrafica();








// $('#myChart').ready(function (indicador) {
    // var dataPoints = [];
// 
    // var options = {
        // animationEnabled: true,
        // theme: "light2",
        // title: {
            // text: "Precio del euro últimos 31 días"
        // },
        // axisX: {
            // valueFormatString: "DD MMM YYYY",
        // },
        // axisY: {
            // title: `${indicador}`,
            // titleFontSize: 24,
        // },
        // data: [{
            // type: "spline",
            // yValueFormatString: "$#,###.##",
            // dataPoints: dataPoints
        // }]
    // };
// 
    // $.ajax({
        // type: "GET",
        // url: urlIndicadores + indicador,
        // dataType: "json",
        // success: function (datos) {
            // let datosApi = datos.serie;
            // console.log(datosApi);
            // for (var i = 0; i < datosApi.length; i++) {
                // dataPoints.push({
                    // x: new Date(datosApi[i].fecha),
                    // y: datosApi[i].valor
                // });
            // }
            // $("#chartContainer").CanvasJSChart(options);
        // },
        // error: function (error) {
            // console.log(error);
        // }
    // });
// });