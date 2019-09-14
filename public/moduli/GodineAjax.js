var GodineAjax = (function(){
    var konstruktor = function(divSadrzaj){
        
        var http = new XMLHttpRequest();

        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200)
            {    
                var json = JSON.parse(http.response);
                var kockice = '<div class="kockica">';
                for(let i = 0; i < json.length; i++){
                    kockice += '<div class="godina">';
                    kockice += '<h4>' + json[i].nazivGod + ' </h4>';
                    kockice += '<p> nazivGod: ' + json[i].nazivGod + ' </p>'; 
                    kockice += '<p> nazivRepVje: ' + json[i].nazivRepVje + ' </p>';
                    kockice += '<p> nazivRepSpi: ' + json[i].nazivRepSpi + ' </p>';
                    kockice += '</div>';
                }
                kockice += '</div>';
                
                divSadrzaj.innerHTML = kockice;
            }
        };
        
        return {
            osvjezi:function(){
                http.open("GET", "/godine", false);
                http.send();
            }
        }
    }
    return konstruktor;
}());
    