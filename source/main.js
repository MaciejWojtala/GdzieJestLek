const sample = document.querySelector("sample");
const inpt = document.getElementById("in");
const but = document.getElementById("but");
const l = document.getElementById("L");
const r = document.getElementById("R");

var tab;
var lowRow;
var highRow;
var maxRows;
var HTMLTabElems;
var newTable;
var rowSpanTab;
var rows;
var cols;
var firstInSpan;
var prevColSpan;

but.disabled = true;
but.onclick = func;
inpt.value = "";
inpt.oninput = () => {
    if(inpt.value !== ""){
	but.disabled = false;
    } else {
	but.disabled = true;
    }
};

l.disabled = true;
r.disabled = true;

l.disabled = true;
r.disabled = true;

function check(asci) {
    return (
	(asci >= 32) && (asci <= 122) &&
	(asci < 33 || asci > 39) &&
	(asci != 59) &&
	(asci < 63 || asci > 64) &&
	(asci < 91 || asci > 96)
	);    
}

function eror(str) {
    sample.innerText = str;
} 

function func() {
    for(var i=0;i<inpt.value.length;i++){
		if(!check(inpt.value.charCodeAt(i))){
			error("Zle slowo");
			return;
		}
	}
    $.ajax({
       	url: 'go.php',
       	type: 'post',
		data: { str : inpt.value },
		errror: function() {
	    	error("polaczenie z serwerem zawiodlo");
		},
       	success: function(data) {    
			var obj;
			if(data === "Arraynull") return;
			try {
				obj = JSON.parse(data);
			} catch(e) {
				sample.innerText = "ERROR while parsing";	
				return;
			}
			if(obj === null) return;
			tab = obj;
			setParams();
			rowSpanTabPrepare();
			HTMLTabElemsPrepare();
			changeView(true);
		}
	});
}
