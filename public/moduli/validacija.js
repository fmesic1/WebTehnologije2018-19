var Validacija = (function(){

    //var imeb, godinab, repozitorijb, indeksb, nazivb, passwordb, urlb;
    var bools = [];    
    var div;
    var element;
    var ispisi = function(){
        element.innerHTML = "";
        var ispis = "Sljedeca polja nisu validna: ";        
        var i;
        for(i = 0; i < 7; i++)
            if(bools[i] !== "")
                break;
        
        if(i === 7)
            return;
        
        for(i = 0; i < 7; i++)
            ispis += bools[i];
        
        var otkinemoZadnjiZarez = ispis.substr(0,ispis.length-1);
        element.innerHTML = otkinemoZadnjiZarez;
        
        div.prepend(element);        
    }
    
    var konstruktor = function(divElementPoruke){
     
        element = document.createElement("p");
        div = divElementPoruke;
        for(var i = 0; i < 7; i++)
            bools[i] = "";
        
        return{
            ime:function(inputElement){
                var regex1 = RegExp('([A-Z][A-Za-z]([A-Za-z]*\'?[A-Za-z])*[ -]?){0,3}([A-Z][A-Za-z]([A-Za-z]*\'?[A-Za-z])*){1}');
                if(!regex1.test(inputElement.value))
                {
                    bools[0] = "ime,";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[0] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            },
            godina:function(inputElement){
                //ovdje se nesto pojebalo, malo je reci
                var regex2 = RegExp('\d{4}\/\d{4}');
                if(regex2.test(inputElement.value))
                {
                    if(parseInt(inputElement.value.substr(0,3),10)+1 !== Number(inputElement.value.substr(5,8)))
                        bools[1] = "godina,";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[1] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            },
            repozitorij:function(inputElement,regex){
                var regex3 = RegExp(regex);
                if(!regex3.test(inputElement.value))
                {
                    bools[2] = "repozitorij,";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[2] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            },
            index:function(inputElement){
                var regex4 = RegExp('(1[4-9]|20)[0-9]{3}');
                if(!regex4.test(inputElement.value))
                {
                    bools[3] = "indeks,";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[3] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            },
            naziv:function(inputElement){
                var regex5 = RegExp('^[A-Za-z]([0-9a-zA-z]|[\\/\-\?!:;,\'\"])+([0-9a-z])$');
                
                if(!regex5.test(inputElement.value))
                {
                    bools[4] = "naziv,";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[4] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            },
            
            password:function(inputElement){
                var regex6 = RegExp('^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{8,}$|^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{8,}$|^(?=.*[A-Z])(?=.*[a-z])[A-z]{8,}$|^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])[A-z0-9]{8,}$');
                if(!regex6.test(inputElement.value))
                {
                    bools[5] = "password,";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[5] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            },
            url:function(inputElement){
                var regex7 = RegExp('(https ?| ftp | ssh) \: \/\/[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\/?([a-z0-9]+(\-[a-z0-9]+)*(\/[a-z0-9]+(\-[a-z0-9]+)*)*)?(\?[a-z0-9]+(\-[a-z0-9]+)*\=[a-z0-9]+(\-[a-z0-9]+)*(\&[a-z0-9]+(\-[a-z0-9]+)*\=[a-z0-9]+(\-[a-z0-9]+)*)*)*');
                if(!regex7.test(inputElement.value))
                {
                    bools[6] = "url";
                    inputElement.style.backgroundColor = "orangered";
                }
                else 
                {
                    bools[6] = "";
                    inputElement.style.backgroundColor = "white";
                }
                ispisi();
            }
        };
    }
             
    return konstruktor;
}());