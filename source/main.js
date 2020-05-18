const sample = document.querySelector("sample");
const inpt = document.getElementById("in");
const but = document.getElementById("but");
const l = document.getElementById("L");
const r = document.getElementById("R");

var tab; // dane do wyświetlenia
var start = 0; // indeks pierwszego wiersz z całego wyniku
var is_more; // czy jest coś o większym indeksie
var HTMLTabElems; // tablica elementów tbody do wyświetlenia
var rowSpanTab; // talbica wartośći rowspan
var rows; // ilość wierszy do wyświetlenia
var cols; // ilość kolumn do wyświetlenia
var firstInSpan; // pomocniecze do tworzenia HTMLTabElems
var prevColSpan; // -||-
var word = "";

but.disabled = true;
but.onclick = () => {
    func(1);         
};
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

function check(asci) {
    return (
	(asci >= 32) && (asci <= 122) &&
	(asci < 33 || asci > 39) &&
	(asci != 59) &&
	(asci < 63 || asci > 64) &&
	(asci < 91 || asci > 96)
	);    
}

function tell(str) {
    sample.innerText = str;
} 

function func(new_tab) {
    if(new_tab) {
	word = inpt.value;
    }
    for(var i=0; i < word.length ;i++){
	if(!check(inpt.value.charCodeAt(i))){
	    tell("Zle slowo");
	    return;
	}
    }
    $.ajax({
       	url: 'go.php',
       	type: 'post',
		data: { str : word, start : start},
		errror: function() {
	    		tell("polaczenie z serwerem zawiodlo");
		},
       	success: function(data) {  
			var obj;
			try {
				obj = JSON.parse(data);
			} catch(e) {
				tell(data);
				return;
			}
			tab = obj.tab;
			if(tab.length == 0) {
                                tell("Pusty wynik");
				return;
			}
			is_more = parseInt(obj.is_more);
			start = parseInt(obj.start);
			setParams();
			rowSpanTabPrepare();
			HTMLTabElemsPrepare();
			disButs();
			display();
		}
	});
}
