import React, { useEffect , useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarController, BarElement, Title , CategoryScale, LinearScale } from 'chart.js';

ChartJS.register( BarController , BarElement , Title ,  CategoryScale , LinearScale);
var dataChart = {
    labels: ['Jun', 'Jul', 'Aug'],
    datasets: [
      {
        id: 1,
        label: '',
        data: [5],
      },
      {
        id: 2,
        label: '',
        data: [3],
      },
    ],
  }
function GraficoComponent(){
    return <Bar data={dataChart} />
}
export default GraficoComponent