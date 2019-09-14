var mojDiv = document.getElementById("login");

var username = document.getElementById("username");
var password = document.getElementById("password");
var button = document.getElementById("button");

var validacija = new Validacija(mojDiv);


button.addEventListener("click", function(){
    validacija.naziv(username);
    validacija.password(password);
});


