function setParams() {
    lowRow = -1;
    highRow = -1;
    maxRows = 8;
    HTMLTabElems = [];
    newTable = true;
    rowSpanTab = JSON.parse(JSON.stringify(tab));
    rows = tab.length;
    cols = tab[0].length;
    firstInSpan = 0;
    prevColSpan = rows;
}

function rowSpanTabPrepare () { 
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            rowSpanTab[i][j] = 0;
        }
    }

    for(let j=0;j<cols;j++){
        firstInSpan = 0;
        rowSpanTab[0][j] = 1;
        for(let i=1;i<rows;i++){
            if(tab[i][j] === tab[i-1][j] && prevColSpan > 0){
                rowSpanTab[firstInSpan][j]++;
            } else {
                firstInSpan = i;
            }
            if(prevColSpan === 0) {
                prevColSpan = rowSpanTab[i][j-1];
            }
            prevColSpan--;
            if(firstInSpan == i) {
                rowSpanTab[i][j] = 1;
            }
        }
        prevColSpan = rowSpanTab[0][j] - 1;
    }
}

function HTMLTabElemsPrepare () {
    let currColSpan = 0;
    for(let i=0;i<rows;i++){
        if(currColSpan === 0){
            currColSpan = rowSpanTab[i][1];
            HTMLTabElems[HTMLTabElems.length] = document.createElement("table");
            HTMLTabElems[HTMLTabElems.length-1].id = "displayTab"+HTMLTabElems.length;
        }
        let row =  HTMLTabElems[HTMLTabElems.length-1].insertRow();
        for(let j=0;j<cols;j++){
            let col = j;
            if(col === 0) col = 1;
            if(rowSpanTab[i][col] > 0) {
                let cell = row.insertCell();
                cell.rowSpan = rowSpanTab[i][col];
                cell.innerText = ""+tab[i][j];
            }
        }
        currColSpan--;
    }
}

function display() {
    let tabi = document.createElement("table");
    for(let i=lowRow; i<=highRow; i++) {
     	let bod = HTMLTabElems[i].childNodes[0].cloneNode(true);
	tabi.appendChild(bod);
    }
    sample.innerHTML = "";
    sample.appendChild(tabi);
}

//handles buttons
function disButs() {
    r.disabled = (highRow === HTMLTabElems.length-1);
    l.disabled = (lowRow === 0);
} 

function changeView(a) {
    let count = 0;
    let i = 1;
    if(a) {
	do {
	    count += parseInt(HTMLTabElems[highRow+i].childNodes[0].childNodes[0].childNodes[0].getAttribute("rowspan"));
	    i++;
	} while(count < 8 && HTMLTabElems.length > highRow+i);
	lowRow = highRow+1;
	highRow += i-1;
	if(count > 8 && i > 2) {
	    highRow--;
	}
    } else {
	 do {
            count += parseInt(HTMLTabElems[lowRow-i].childNodes[0].childNodes[0].childNodes[0].getAttribute("rowspan"));
	    i++; 
        } while(count < 8 && lowRow-i > -1);
	highRow = lowRow-1;
	lowRow -= (i-1);
	if(count > 8 && i > 2) {
	    lowRow++;
	}
    }
    disButs();
    display();
}

l.onclick = () => {
    changeView(false);
}

r.onclick = () => {
    changeView(true);
}
