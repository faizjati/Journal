
// Data Trade
let trades = JSON.parse(localStorage.getItem("trades")) || [];

// Saldo Awal
let balance = 0;
// ===============================
// Kalender
// ===============================

let currentDate = new Date();

// ===============================
// Ambil Elemen HTML
// ===============================

const tanggal = document.getElementById("tanggal");
const pair = document.getElementById("pair");
const type = document.getElementById("type");
const lot = document.getElementById("lot");
const profit = document.getElementById("profit");

const addTrade = document.getElementById("addTrade");

const table = document.getElementById("tradeTable");

const totalTrade = document.getElementById("totalTrade");
const profitTrade = document.getElementById("profitTrade");
const lossTrade = document.getElementById("lossTrade");
const winRate = document.getElementById("winRate");
const balanceText = document.getElementById("balance");

// ===============================
// Tombol Tambah Trade
// ===============================

addTrade.addEventListener("click", tambahTrade);

// ===============================
// Tambah Trade
// ===============================

function tambahTrade(){

    if(
        tanggal.value==="" ||
        lot.value==="" ||
        profit.value===""
    ){

        alert("Lengkapi data terlebih dahulu");
        return;

    }

    let data={

        id:Date.now(),

        tanggal:tanggal.value,

        pair:pair.value,

        type:type.value,

        lot:parseFloat(lot.value),

        profit:parseFloat(profit.value)

    };

    trades.push(data);

    simpanData();

    tampilkanTrade();

    resetForm();

}

// ===============================
// Reset Form
// ===============================

function resetForm(){

    tanggal.value="";
    lot.value="";
    profit.value="";

}

// ===============================
// Simpan ke Local Storage
// ===============================

function simpanData(){

    localStorage.setItem(
        "trades",
        JSON.stringify(trades)
    );

}

// ===============================
// Menampilkan Data
// ===============================

function tampilkanTrade(){

    table.innerHTML="";

    let total=0;
    let win=0;
    let lose=0;

    balance=0;

    trades.forEach((trade,index)=>{

        total++;

        balance+=trade.profit;

        if(trade.profit>=0){

            win++;

        }else{

            lose++;

        }

        let row=document.createElement("tr");

        row.innerHTML=`

        <td>${index+1}</td>

        <td>${trade.tanggal}</td>

        <td>${trade.pair}</td>

        <td>${trade.type}</td>

        <td>${trade.lot}</td>

        <td>

        Rp ${trade.profit.toLocaleString()}

        </td>

        <td>

        ${
            trade.profit>=0

            ?

            '<span class="profit">Profit</span>'

            :

            '<span class="loss">Loss</span>'

        }

        </td>

        <td>

        <button
        class="delete"
        onclick="hapusTrade(${trade.id})">

        Hapus

        </button>

        </td>

        `;

        table.appendChild(row);

    });

    totalTrade.innerHTML=total;

    profitTrade.innerHTML=win;

    lossTrade.innerHTML=lose;

    let wr=0;

    if(total>0){

        wr=(win/total)*100;

    }

    winRate.innerHTML=wr.toFixed(1)+" %";

    balanceText.innerHTML=
    "Rp "+
    balance.toLocaleString();

    if(typeof updateChart==="function"){

        updateChart();

    }
    tampilkanKalender();

}

// ===============================
// Hapus Trade
// ===============================

function hapusTrade(id){

    if(confirm("Hapus transaksi ini?")){

        trades=
        trades.filter(
            trade=>trade.id!=id
        );

        simpanData();

        tampilkanTrade();

    }

}

// ===============================
// Dark Mode
// ===============================

const dark=document.getElementById("darkMode");

dark.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

});

// ===============================
// Saat Web Dibuka
// ===============================
// ===============================
// Kalender Trading
// ===============================

function tampilkanKalender(){

    const calendar=document.getElementById("calendar");
    const monthYear=document.getElementById("monthYear");

    calendar.innerHTML="";

    const year=currentDate.getFullYear();
    const month=currentDate.getMonth();

    monthYear.innerHTML=currentDate.toLocaleString("id-ID",{
        month:"long",
        year:"numeric"
    });

    // Menghitung hari pertama
    let firstDay=new Date(year,month,1).getDay();

    // Ubah supaya Senin = awal minggu
    firstDay=(firstDay===0)?6:firstDay-1;

    // Jumlah hari dalam bulan
    let totalHari=new Date(year,month+1,0).getDate();

    // Menjumlahkan profit per tanggal
    let dailyProfit={};

    trades.forEach(trade=>{

        let d=new Date(trade.tanggal);

        if(
            d.getMonth()===month &&
            d.getFullYear()===year
        ){

            let tanggal=d.getDate();

            if(!dailyProfit[tanggal]){

                dailyProfit[tanggal]=0;

            }

            dailyProfit[tanggal]+=trade.profit;

        }

    });

    // Kotak kosong sebelum tanggal 1

    for(let i=0;i<firstDay;i++){

        let kosong=document.createElement("div");

        kosong.className="day empty";

        calendar.appendChild(kosong);

    }

    // Membuat semua tanggal

    for(let i=1;i<=totalHari;i++){

        let box=document.createElement("div");

        box.className="day";

        let profit=dailyProfit[i] || 0;

        if(profit>0){

            box.classList.add("profitDay");

        }

        else if(profit<0){

            box.classList.add("lossDay");

        }

        else{

            box.classList.add("normalDay");

        }

        box.innerHTML=`

            <div class="dayNumber">${i}</div>

            <div class="dayProfit">

            ${
                profit==0
                ?
                ""
                :
                "Rp "+profit.toLocaleString()
            }

            </div>

        `;

        box.onclick=function(){

            detailHari(i);

        };

        calendar.appendChild(box);

    }

}

function detailHari(hari){

    const bulan=currentDate.getMonth();
    const tahun=currentDate.getFullYear();

    let hasil="";

    trades.forEach(trade=>{

        let d=new Date(trade.tanggal);

        if(

            d.getDate()===hari &&
            d.getMonth()===bulan &&
            d.getFullYear()===tahun

        ){

            hasil+=

            trade.pair+

            " | "+

            trade.type+

            "\nLot : "+

            trade.lot+

            "\nProfit : Rp "+

            trade.profit.toLocaleString()

            +

            "\n\n";

        }

    });

    if(hasil===""){

        alert("Tidak ada trade.");

    }

    else{

        alert(hasil);

    }

}

document.getElementById("prevMonth").onclick=function(){

    currentDate.setMonth(currentDate.getMonth()-1);

    tampilkanKalender();

}

document.getElementById("nextMonth").onclick=function(){

    currentDate.setMonth(currentDate.getMonth()+1);

    tampilkanKalender();

}
tampilkanTrade();