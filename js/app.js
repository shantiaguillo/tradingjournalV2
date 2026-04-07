const form=document.getElementById("tradeForm")
const tableBody=document.querySelector("#tradeTable tbody")
const darkBtn=document.getElementById("darkModeBtn")
const pdfBtn=document.getElementById("downloadPdfBtn")

const simbolo=document.getElementById("simbolo")
const fechaApertura=document.getElementById("fechaApertura")
const fechaCierre=document.getElementById("fechaCierre")
const horaApertura=document.getElementById("horaApertura")
const horaCierre=document.getElementById("horaCierre")
const sesion=document.getElementById("sesion")
const direccion=document.getElementById("direccion")
const volumen=document.getElementById("volumen")
const margen=document.getElementById("margen")
const precioApertura=document.getElementById("precioApertura")
const precioCierre=document.getElementById("precioCierre")
const sl=document.getElementById("sl")
const tp=document.getElementById("tp")
const resultado=document.getElementById("resultado")
const beneficio=document.getElementById("beneficio")

let trades=JSON.parse(localStorage.getItem("trades"))||[]
let editIndex=null

function renderTrades(){

tableBody.innerHTML=""

trades.forEach((trade,index)=>{

const row=document.createElement("tr")

let resultClass=""
if(trade.resultado==="Win") resultClass="win"
if(trade.resultado==="Loss") resultClass="loss"
if(trade.resultado==="BE") resultClass="be"

row.innerHTML=`
<td>${trade.simbolo}</td>
<td>${trade.fechaApertura}</td>
<td>${trade.fechaCierre}</td>
<td>${trade.horaApertura}</td>
<td>${trade.horaCierre}</td>
<td>${trade.sesion}</td>
<td>${trade.direccion}</td>
<td>${trade.volumen}</td>
<td>${trade.margen}</td>
<td>${trade.precioApertura}</td>
<td>${trade.precioCierre}</td>
<td>${trade.sl}</td>
<td>${trade.tp}</td>
<td class="${resultClass}">${trade.resultado}</td>
<td>${trade.beneficio}</td>

<td>
<button class="action-btn edit-btn" onclick="editTrade(${index})">Editar</button>
<button class="action-btn delete-btn" onclick="deleteTrade(${index})">Eliminar</button>
</td>
`

tableBody.appendChild(row)

})

}

renderTrades()

form.addEventListener("submit",e=>{

e.preventDefault()

const trade={
simbolo:simbolo.value,
fechaApertura:fechaApertura.value,
fechaCierre:fechaCierre.value,
horaApertura:horaApertura.value,
horaCierre:horaCierre.value,
sesion:sesion.value,
direccion:direccion.value,
volumen:volumen.value,
margen:margen.value,
precioApertura:precioApertura.value,
precioCierre:precioCierre.value,
sl:sl.value,
tp:tp.value,
resultado:resultado.value,
beneficio:beneficio.value
}

if(editIndex===null){
trades.push(trade)
}else{
trades[editIndex]=trade
editIndex=null
}

localStorage.setItem("trades",JSON.stringify(trades))

renderTrades()
form.reset()

})

function deleteTrade(index){
trades.splice(index,1)
localStorage.setItem("trades",JSON.stringify(trades))
renderTrades()
}

function editTrade(index){

const trade=trades[index]

simbolo.value=trade.simbolo
fechaApertura.value=trade.fechaApertura
fechaCierre.value=trade.fechaCierre
horaApertura.value=trade.horaApertura
horaCierre.value=trade.horaCierre
sesion.value=trade.sesion
direccion.value=trade.direccion
volumen.value=trade.volumen
margen.value=trade.margen
precioApertura.value=trade.precioApertura
precioCierre.value=trade.precioCierre
sl.value=trade.sl
tp.value=trade.tp
resultado.value=trade.resultado
beneficio.value=trade.beneficio

editIndex=index

}

/* DARK MODE */

function applyTheme(){

const theme=localStorage.getItem("theme")

if(theme==="dark"){
document.body.classList.add("dark-mode")
darkBtn.textContent="☀️ Clear Mode"
}else{
darkBtn.textContent="🌙 Dark Mode"
}

}

applyTheme()

darkBtn.onclick=()=>{

if(document.body.classList.contains("dark-mode")){
document.body.classList.remove("dark-mode")
localStorage.setItem("theme","light")
darkBtn.textContent="🌙 Dark Mode"
}else{
document.body.classList.add("dark-mode")
localStorage.setItem("theme","dark")
darkBtn.textContent="☀️ Clear Mode"
}

}

/* PDF */

pdfBtn.onclick=()=>{

if(trades.length===0){
alert("No hay trades registrados para descargar.")
return
}

const {jsPDF}=window.jspdf
const doc=new jsPDF()

const rows=trades.map(t=>[
t.simbolo,
t.fechaApertura,
t.fechaCierre,
t.horaApertura,
t.horaCierre,
t.sesion,
t.direccion,
t.volumen,
t.margen,
t.precioApertura,
t.precioCierre,
t.sl,
t.tp,
t.resultado,
t.beneficio
])

doc.text("Trading Journal",14,15)

doc.autoTable({
head:[['Símbolo','F.Apertura','F.Cierre','H.Apertura','H.Cierre','Sesión','Dirección','Volumen','Margen','P.Apertura','P.Cierre','SL','TP','Resultado','P/L']],
body:rows,
startY:20
})

doc.save("historial_trades.pdf")

}
