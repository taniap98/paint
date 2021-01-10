const pen = {
    size: 3,
    color: '#000000',
    penType: 'line',
    background:"#FFFFFF",

    mouseX:null,
    mouseY:null,
    lastX: null,
    lastY: null,

    mouseDown:false,
    erase:false,

    canvas:null,
    context:null,
    canvasFinal:null,
    contextFinal:null,
    backgroundCanvas:null,
    backgroundContext:null,
};

pen.load = function(){

    //initializarea tuturor elementelor de tip canvas si context.
    //cele de tip final sunt folosite pentru salvarea formei dupa terminarea preview-ului
    //canvas si context sunt folosite pentru preview(sterge si redesenare la fiecare miscare)
    pen.canvas = document.getElementById("paintCanvas");
    pen.context = pen.canvas.getContext('2d');
    pen.context.canvas.width = window.innerWidth;
    pen.context.canvas.height = window.innerHeight;
    pen.canvasFinal = document.getElementById("finalCanvas");
    pen.contextFinal = pen.canvasFinal.getContext('2d');
    pen.contextFinal.canvas.width = window.innerWidth;
    pen.contextFinal.canvas.height = window.innerHeight;
    pen.backgroundCanvas = document.getElementById("backgroundCanvas");
    pen.backgroundContext = pen.backgroundCanvas.getContext('2d');
    pen.backgroundContext.canvas.width = window.innerWidth;
    pen.backgroundContext.canvas.height = window.innerHeight;
    pen.drawBackground();

    //setare culoare de desenare in functie de culoarea selectata
    const colors = document.getElementsByClassName("colors");
    for(let i = 0; i < colors.length; i++){
        colors.item(i).addEventListener("click", (e) => {
            const picker = document.getElementById("colorPicker");

            let valuesRGB = colors.item(i).style.backgroundColor;
            valuesRGB = valuesRGB.substring(4, valuesRGB.length - 1);
            valuesRGB = valuesRGB.split(",");
            
            colorHex = "#" + rgbToHex(valuesRGB[0]) + rgbToHex(valuesRGB[1]) + rgbToHex(valuesRGB[2]);
                   
            picker.value = colorHex;
            pen.color = colorHex;
        });
    }

    //setare culoare background in functie de culoarea selectata
    const colorsBK = document.getElementsByClassName("colorsBK");
    for(let i = 0; i < colorsBK.length; i++){
        colorsBK.item(i).addEventListener("click", (e) => {
            const pickerBK = document.getElementById("colorPickerBK");
 
            let valuesRGB = colorsBK.item(i).style.backgroundColor;
            valuesRGB = valuesRGB.substring(4, valuesRGB.length - 1);
            valuesRGB = valuesRGB.split(",");
            
            colorHex = "#" + rgbToHex(valuesRGB[0]) + rgbToHex(valuesRGB[1]) + rgbToHex(valuesRGB[2]);
                   
            pickerBK.value = colorHex;
            pen.background = colorHex;
            pen.drawBackground();
            
        });
    }

    //apelarea functiei pentru desenarea dimensiunilor de creion posibile
    pen.drawDot(7);

    //la declansarea evenimentului retinem coordonatele initiale 
    pen.canvas.addEventListener("mousedown", (e) => {
        pen.mouseX = e.offsetX / e.target.clientWidth * e.target.width;
        pen.mouseY =  e.offsetY / e.target.clientHeight * e.target.height;   
        pen.lastX = pen.mouseX;
        pen.lastY = pen.mouseY;
        pen.mouseDown = true;     
    })

    //la declansarea evenimentului mouseup desenam forma finala in functie de
    //coordonatele initiale si finale pe Canvasul final
    pen.canvas.addEventListener("mouseup", (e) => {
        pen.mouseDown = false; 

        pen.contextFinal.strokeStyle = pen.color;
        pen.contextFinal.lineWidth = pen.size;
        if(pen.penType === 'line') {
            pen.contextFinal.beginPath();
            pen.contextFinal.moveTo(pen.mouseX, pen.mouseY);
            pen.contextFinal.lineTo(pen.lastX + 1, pen.lastY + 1);
            pen.contextFinal.stroke();
        }
        if(pen.penType === 'ellipse'){
            const radiusX = Math.abs((pen.mouseX - pen.lastX)) / 2;
            const radiusY = Math.abs((pen.mouseY - pen.lastY)) / 2;
            pen.contextFinal.beginPath();
            pen.contextFinal.ellipse(pen.mouseX, pen.mouseY, radiusX, radiusY, Math.PI / 4, 0, 2 * Math.PI);
            pen.contextFinal.stroke();
        }
        if(pen.penType === 'rectangle'){
            const width = Math.abs((pen.mouseX - pen.lastX));
            const height = Math.abs((pen.mouseY - pen.lastY));
            pen.contextFinal.beginPath();
            pen.contextFinal.rect(pen.mouseX, pen.mouseY, width, height);
            pen.contextFinal.stroke();
        }
        pen.context.clearRect(0, 0, pen.canvas.width, pen.canvas.height);

       
          
    })

    //la fiecare declansare a evenimentului mousemove stergem forma creata si o redesenam
    //in functie de coordonatele initiale si cele actuale pentru realizarea previewului
    pen.canvas.addEventListener("mousemove", (e) => {
        if(pen.mouseDown){
            pen.lastX = e.offsetX / e.target.clientWidth * e.target.width;
            pen.lastY = e.offsetY / e.target.clientHeight * e.target.height
           
            pen.context.clearRect(0, 0, pen.canvas.width, pen.canvas.height);
            
            pen.context.strokeStyle = pen.color;
            pen.context.lineWidth = pen.size;
            
            if(pen.penType === 'line'){      
                pen.context.beginPath();
                pen.context.moveTo(pen.mouseX, pen.mouseY);
                pen.context.lineTo(pen.lastX + 1, pen.lastY + 1);
                pen.context.stroke();
            }
            if(pen.penType === 'ellipse'){
                const radiusX = Math.abs((pen.mouseX - pen.lastX)) / 2;
                const radiusY = Math.abs((pen.mouseY - pen.lastY)) / 2 ;
                pen.context.beginPath();
                pen.context.ellipse(pen.mouseX, pen.mouseY, radiusX, radiusY, Math.PI / 4, 0, 2 * Math.PI);
                pen.context.stroke();
            }
            if(pen.penType === 'rectangle'){
                const width = Math.abs((pen.mouseX - pen.lastX));
                const height = Math.abs((pen.mouseY - pen.lastY));
                pen.context.beginPath();
                pen.context.rect(pen.mouseX, pen.mouseY, width, height);
                pen.context.stroke();
            }
        }    
    })


}

//functie folosita pentru afisarea dimensiunilor creionului
pen.drawDot = function(size) {
    const canvases = document.getElementsByClassName("sizePen");
  
    for(let i = 0; i < canvases.length; i++) {
        const context = canvases[i].getContext('2d');
        context.fillStyle = "#000000";
        context.arc(canvases[i].width / 2, canvases[i].height / 2, (i+1)*size, 0, 2 * Math.PI);
        context.stroke()
        context.fill();

        canvases[i].addEventListener("click", () => {
            pen.size = (i + 1) * 5;
        })

        size += 1;

        
    }
}

//desenarea backgroundului in functie de culoarea selectata
pen.drawBackground = function(){ 
    pen.backgroundContext.fillStyle = pen.background;
    pen.backgroundContext.fillRect(0, 0, pen.canvas.width, pen.canvas.height);
}

//setarea tipului de instrument de desenare
let img = document.getElementById("el");
img.addEventListener("click", () => {
    pen.penType = 'ellipse';
});
img = document.getElementById("ln");
img.addEventListener("click", () => {
    pen.penType = 'line';
})
img = document.getElementById("rect");
img.addEventListener("click", () => {
    pen.penType = 'rectangle';
})


//cand vrem sa salvam poza vom desena ce se afla pe canvasul final in canvasul cu background
//pentru a salva imaginea cu tot cu backgroundul selectat
const btnSave = document.getElementById("btnSave");
btnSave.addEventListener("click", (e) => {
    pen.backgroundContext.drawImage(pen.canvasFinal, 0, 0);
    let dataUrl = document.getElementById("backgroundCanvas").toDataURL('image/png');
    e.target.parentElement.setAttribute("href", dataUrl);
});

//functie pentru a transforma culoarea din rgb in hex
function rgbToHex(c) {
    c = parseInt(c);
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
