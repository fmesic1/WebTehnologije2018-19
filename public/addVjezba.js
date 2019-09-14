var mojDiv = document.getElementById("glavniSadrzaj");

var naziv = document.getElementById("nazivVjezbe");
var button = document.getElementById("butttton");

var validacija = new Validacija(mojDiv);

button.addEventListener("click", function(){
    validacija.naziv(naziv);
})

var select = document.getElementsByName("sGodine");
//console.log(select);    

var http = new XMLHttpRequest();

http.open("GET", "/godine", false);
http.send();
var godineJson = JSON.parse(http.response);

var sveGodine = "";
for(var i = 0; i < godineJson.length; i++)
{
    sveGodine += "<option>";
    sveGodine += godineJson[i].nazivGod;
    sveGodine += "</option>";
}

select[0].innerHTML = sveGodine;
select[1].innerHTML = sveGodine;

http.open("GET", "/vjezbe", false);
http.send();
var vjezbeJSON = JSON.parse(http.response);
//console.log(http.response);

var sveVjezbe = "";
for(var i = 0; i < vjezbeJSON.length; i++)
{
    sveVjezbe += "<option>";
    sveVjezbe += vjezbeJSON[i].naziv;
    sveVjezbe += "</option>";
}

var selectVjezbe = document.getElementsByName("sVjezbe");
selectVjezbe[0].innerHTML = sveVjezbe;
selectVjezbe[1].innerHTML = sveVjezbe;


if(selectVjezbe[1].value != null)
{
    http.open("GET", "/zadaci?sVjezbe=" + selectVjezbe[1].value , false); 
    http.send();

    var zadaciJSON = JSON.parse(http.response);
    var sviZadaci = "";
     
    for(var i = 0; i < zadaciJSON.length; i++)
    {
        sviZadaci += "<option>";
        sviZadaci += zadaciJSON[i].naziv;
        sviZadaci += "</option>";
    }
    var selectZadatak = document.getElementsByName("sZadatak")[0];
    selectZadatak.innerHTML = sviZadaci;
}


selectVjezbe[1].addEventListener("change", function(){
    http.open("GET", "/zadaci?sVjezbe=" + selectVjezbe[1].value , false); 
    http.send();

    var zadaciJSON = JSON.parse(http.response);
    var sviZadaci = "";
     
    for(var i = 0; i < zadaciJSON.length; i++)
    {
        sviZadaci += "<option>";
        sviZadaci += zadaciJSON[i].naziv;
        sviZadaci += "</option>";
    }
    var selectZadatak = document.getElementsByName("sZadatak")[0];
    selectZadatak.innerHTML = sviZadaci;
})

var buttonDodajPoveziZadatak = document.getElementsByName("dZadatak")[0];

buttonDodajPoveziZadatak.addEventListener("click", function(){
    http.open("GET", "/vjezbe?naziv=" + selectVjezbe[1].value, false);
    http.send();
    var idVjezbe = JSON.parse(http.response).id;

    buttonDodajPoveziZadatak.formAction = '/vjezba/' + idVjezbe + '/zadatak';
})