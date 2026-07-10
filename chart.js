// =========================================
// chart.js
// Grafik Perkembangan Balance
// =========================================

let ctx = document.getElementById("balanceChart").getContext("2d");

let balanceChart = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [

            {

                label: "Perkembangan Balance",

                data: [],

                borderColor: "#27ae60",

                backgroundColor: "rgba(39,174,96,0.2)",

                borderWidth: 3,

                tension: 0.3,

                fill: true,

                pointRadius: 5,

                pointHoverRadius: 7

            }

        ]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {

                display: true

            }

        },

        scales: {

            y: {

                beginAtZero: true

            }

        }

    }

});


// =========================================
// Update Grafik
// =========================================

function updateChart(){

    let labels = [];

    let saldo = [];

    let total = 0;

    trades.forEach((trade,index)=>{

        total += trade.profit;

        labels.push("Trade " + (index+1));

        saldo.push(total);

    });

    balanceChart.data.labels = labels;

    balanceChart.data.datasets[0].data = saldo;

    balanceChart.update();

}