window.onload = async function() {
    

  baud = document.getElementById('baud');
  baudValue = baud.value;
  
  
    document.getElementById('connect').addEventListener('click', async () => {
  baudValue = baud.value;    


      const port = await navigator.serial.requestPort();
      const { usbProductId, usbVendorId } = port.getInfo();

      const ports = await navigator.serial.getPorts();
    

      // Wait for the serial port to open.
      await port.open({ baudRate: baudValue });
    msg = document.getElementById('dicMessage');
    resestButton = document.getElementById('resetButton')
    manualButton = document.getElementById('manualMode')
    nav  = document.getElementById('navBar');
    disp = document.getElementById('displayer');
    body = document.querySelector('body');
    crop = document.getElementsByClassName('crop');
    showScreen = document.getElementById('showScreen')
    writeScreen = document.getElementById('writeScreen')
    moistureReading = document.getElementsByClassName('moistureReading');
    optimal = document.getElementsByClassName('opt')
    chzfarmed1 = document.getElementsByName('cropsChoose1');chzfarmed2 = document.getElementsByName('cropsChoose2');chzInterval = document.getElementById('chzInterval');
    farmedCrop1= document.getElementById('farmedCrop1');farmedCrop2= document.getElementById('farmedCrop2')


    
    optimal1 = optimal[0];optimal2 = optimal[1];
    optimal1txt = document.createElement('pre');optimal2txt=document.createElement('pre');
    crop1 = crop[0];crop2 = crop[1];moisture1 = moistureReading[0];moisture2 = moistureReading[1];  
    // average moisture display
    moisture1txt = document.createElement('span');moisture2txt = document.createElement('span'); 
    mainBox = document.getElementById('mainBox'); 
    x = nav.getBoundingClientRect();
    mainBox.setAttribute("style",`height : calc(100% - ${x.height}px); top : ${x.height}px;display:block`)
    

    navigator.serial.addEventListener("disconnect", () => {document.body.setAttribute("style","background-color: rgb(109, 109, 109)")
        nav.setAttribute("style","width: 100%;height: 70px;background-color: rgb(126, 195, 255);clear : both");
        msg.style.display = "block";mainBox.setAttribute("style","display:none");
      
      });


  if(port.readable){

 
  //REAL CODE IS HERE
  var mnl=0,p=0,s1=0,s2=0 ;  var c1,c2,interval,avg1,avg2,opt1,opt2
  // Modifications to when we connect 
 document.body.setAttribute("style","background : #ffffff url('DSCN0789.jpg') no-repeat top right ;background-size : cover;background-attachment: fixed;background-clip: border-box;") 
nav.setAttribute("style","background-color : rgba(0, 206, 132, 0.9);")
msg.style.display = "none";




var chzfarmed1val = 0,chzfarmed2val = 0;



 var i = 0;var z = 0;tmp = ""


 // Listen to data coming from the serial device.


async function read(){ const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();
// Listen to data coming from the serial device.
for(;true;) {chzfarmed1val = chzfarmed1[0].value ; chzfarmed2val = chzfarmed2[0].value;chzIntervalval = chzInterval.value;
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  
 
  if(i>=600){i=0;infoBoy(disp);disp="";}
  disp+=value;i++;if(mnl == 1){manualButton.style.backgroundColor = "#0066ff";}else{manualButton.style.backgroundColor = "#971212";}
tmp +=value
  if(z>=100){z=0;showScreen.innerText=  tmp;tmp = 0}
  z++;



}
}

const textEncoder = new TextEncoderStream();
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
const writer = textEncoder.writable.getWriter();
async function write (x){ 
  writer.write(x);
}



//functions to control the Irrigation System

function setFarmSettings(type,value){
  write("1");write("\n");write(type);write("\n");write(value);write("\n")}

function manualToggle(x){write("2");write("\n");write(x);write("\n");}
function reset(){write("2");write("\n");write("rst");write("\n");write("y");write("\n")}
function mnlCntrl(x){write("3"+"\n\n"+x+"\n\n")}

function infoBoy(x){var realdata = [];var realdatai = 0;var index = 0;
  var c1a = []; var c2a = [];var intervala =[];var avg1a = [],avg2a = [],opt1a = [],opt2a = [];

for(index;x[index]!="^";index++){}
index++;
for(index;x[index]!="^";index++){realdata[realdatai++] = x[index];}
realdatai=0;
if((realdata.length<=50)&&(realdata.length>=3)){
mnl = realdata[realdatai++]
p = realdata[realdatai++]
s1 = realdata[realdatai++]
s2 = realdata[realdatai++]
realdatai++;
for(i = 0;!(realdata[realdatai] == "+");i++){c1a[i] = realdata[realdatai];realdatai++}
realdatai++; c1 = c1a.join('')
for(i = 0;!(realdata[realdatai] == "+");i++){c2a[i] = realdata[realdatai];realdatai++}
realdatai++; c2 = c2a.join('')
for(i = 0;!(realdata[realdatai] == "+");i++){intervala[i] = realdata[realdatai];realdatai++}
realdatai++;interval = intervala.join('')
for(i = 0;!(realdata[realdatai] == "+");i++){avg1a[i] = realdata[realdatai];realdatai++}
realdatai++;avg1 = avg1a.join('')
for(i = 0;!(realdata[realdatai] == "+");i++){avg2a[i] = realdata[realdatai];realdatai++}
realdatai++;avg2 = avg2a.join('')
for(i = 0;!(realdata[realdatai] == "+");i++){opt1a[i] = realdata[realdatai];realdatai++}
realdatai++;opt1 = opt1a.join('')
for(i = 0;realdatai<=realdata.length;i++){opt2a[i] = realdata[realdatai];realdatai++}
opt2 = opt2a.join('')

moisture1txt.innerHTML = avg1+" %";
moisture2txt.innerHTML = avg2+" %";
optimal1txt = `Optimal water percentage for first crop is ${opt1}%`
optimal2txt = `Optimal water percentage for second crop is ${opt2}%`
moisture1.appendChild(moisture1txt);moisture2.appendChild(moisture2txt)
optimal1.textContent = optimal1txt;optimal2.textContent = optimal2txt;
farmedCrop1.innerText = c1;farmedCrop2.innerText = c2;

if(mnl == 1){manualButton.style.backgroundColor = "#0066ff";}else{manualButton.style.backgroundColor = "#971212";}

}}
manualButton.addEventListener('click',()=>{;if(mnl == 1){manualButton.style.backgroundColor = "#0066ff";manualToggle("auto")};if(mnl == 0){manualButton.style.backgroundColor = "#971212";manualToggle("mnl")}})
resestButton.addEventListener('click',reset)

 

writeScreen.addEventListener("keydown",(e)=>{if(e.key === "Enter"){inp = writeScreen.value;writer.write(inp+"\n");console.log(inp);writeScreen.value = '';}});

 chzfarmed1[0].addEventListener ("focusout",()=>{setFarmSettings("c1",chzfarmed1val)})
 chzfarmed2[0].addEventListener ("focusout",()=>{setFarmSettings("c2",chzfarmed2val,)})
 chzInterval.addEventListener("blur",()=>{setFarmSettings("p",chzIntervalval)})

read();






}}
)}

