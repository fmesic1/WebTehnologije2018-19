var sGodine = document.getElementsByName("sGodina")[0];

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

sGodine.innerHTML = sveGodine;


var button = document.querySelectorAll("input[type=button]");
var ucitajBTN = button[0];
var dodajBTN = button[1];

var bitBucket;
var NIZstudenti;

ucitajBTN.addEventListener("click", function(){
    if(bitBucket == undefined)
        bitBucket = new BitBucket("neki key", "neki secret");
    NIZstudenti = bitBucket.ucitaj("wtv18", "wtProjekat18", function(){
        console.log("doslo je ovdje");
    })
    console.log(NIZstudenti);
    dodajBTN.disabled = false;
})

dodajBTN.addEventListener("click", function(){
    var http = new XMLHttpRequest();

    http.open("GET", "/godine?naziv=" + sGodine.value, false);
    http.send();
    var idGodine = JSON.parse(http.response).id;

    http.open("POST", "/student", false);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(JSON.stringify([{godina: idGodine},{studenti : JSON.parse(NIZstudenti)}]));

    var odgovor = JSON.parse(http.response);
    alert(odgovor.message);
    dodajBTN.disabled = true;
})