var mojDiv = document.getElementById("glavniSadrzaj");

var naziv1 = document.getElementById("nazivInput");
var button = document.getElementById("buttonSubmit");

var validacija = new Validacija(mojDiv);


button.addEventListener("click", function(){
    validacija.naziv(naziv1);
});

