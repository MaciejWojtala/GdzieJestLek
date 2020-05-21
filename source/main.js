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




l.disabled = true;
r.disabled = true;


var getParams = (url) => {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
var params = getParams(window.location.href);


if(params.word !== undefined) {
	word = params.word;
	inpt.value = word;
}	
if(params.start !== undefined)
	start = parseInt(params.start);
if(start < 0) {
	start = 0;
}
if(word !== "")
	func(); 

but.disabled = (word === "");

but.onclick = () => {
	word = inpt.value;
    window.location.href = `./main.html?word=${word}&start=0`; 
};

inpt.oninput = () => {
	
    if(inpt.value !== ""){
	but.disabled = false;
    } else {
	but.disabled = true;
    }
};

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

function func() {
    for(var i=0; i < word.length ;i++){
		if(!check(word.charCodeAt(i))){
			tell("Zle slowo");
			return;
		}
	}
	if(start < 0){
		tell("Zly start");
		return;
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
