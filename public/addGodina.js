var mojDiv = document.getElementById("side");

var naziv = document.getElementById("naziv");
var rep1 = document.getElementById("rep1");
var rep2 = document.getElementById("rep2");
var button = document.getElementById("button");

var glavni=document.getElementById("glavniSadrzaj");

//var validacija = new Validacija(mojDiv);
//var validacija2 = new Validacija(mojDiv);

var godine = new GodineAjax(glavni);
godine.osvjezi();

/*
button.addEventListener("click", function(){
    validacija.naziv(naziv);
    validacija.repozitorij(rep1, "www");
    validacija2.repozitorij(rep2, "www");
});
*/

