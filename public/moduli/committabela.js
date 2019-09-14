var CommitTabela = (function(){
    //lokalne varijable idu ovdje
    var divEl;
    var matricaZadataka;
    var novaTabela;
    var tabelaHTML;
    
    var dajMaks = function(){
        var maks = matricaZadataka[0].length;
        for(var i = 1; i < matricaZadataka.length; i++)
        {
            if(matricaZadataka[i].length > maks)
                maks = matricaZadataka[i].length;
        }
        return maks;
    };
    
    
    var crtajTabelu = function(){
        //Ako postoji neka prije nje, brisem je
        //OVO SE NIKAD NE DESI, OVO JEBE SOJKE
        //Svakako moram da napravim novu tabelu
        
        tabelaHTML = "";
        
        tabelaHTML = '<tr>' +
                     '<th> Novi Zadatak </th>' +
                     '<th colspan="' + dajMaks() + '">Commiti </th>' +
                     '</tr>';
        
        for(let i = 0; i < matricaZadataka.length; i++)
        {
            tabelaHTML += '<tr>';
            tabelaHTML += '<td>' + 'Zadatak ' + (i+1) +'</td>';
            
            for(let j = 0; j < matricaZadataka[i].length; j++)
            {
                //<a href="https://bitbucket.org/">1</a>
                if(matricaZadataka[i][j] === "empty")
                    continue;
                tabelaHTML += '<td><a href="' + matricaZadataka[i][j] +'" target="_blank">' + j + '</a></td>';       
            }
            if(dajMaks() == 0)
                tabelaHTML += '<td></td>';
            if(matricaZadataka[i].length !== dajMaks())
                tabelaHTML += '<td colspan="' + (dajMaks() - matricaZadataka[i].length) + '"></td>';
            tabelaHTML += '</tr>';            
        }
        
        novaTabela.innerHTML = tabelaHTML;
    }
    
    var kreirajMatricu = function(brojZadatka){
        matricaZadataka = [];
        for(let i = 0; i < brojZadatka; i++)
            matricaZadataka[i] = [];
    }
    
    var dodajZadatak = function(rbZadatka, url){
        if(rbZadatka > matricaZadataka.length - 1 || rbZadatka < 0)
            return;
        matricaZadataka[rbZadatka].push(url);
    }
    
    var obrisiKomit = function(rbZadatka, rbCommita){
        if(dajMaks()==0 || rbZadatka > matricaZadataka.length - 1 || rbZadatka < 0 || 
           rbCommita < 0 || rbCommita > matricaZadataka[rbZadatka].length || matricaZadataka[rbZadatka][rbCommita] === "empty")
            return -1;
        matricaZadataka[rbZadatka][rbCommita] = "empty";
    }
    
    var editujKomit = function(rbZadatka,rbCommita,url)
    {
        if(rbZadatka > matricaZadataka.length - 1 || rbZadatka < 0 || 
           rbCommita < 0 || rbCommita > matricaZadataka[rbZadatka].length || matricaZadataka[rbZadatka][rbCommita] === "empty")
            return -1;
        matricaZadataka[rbZadatka][rbCommita] = url;
    }
    
    var konstruktor = function(divElement, brojZadatka){
        
        novaTabela = document.createElement("TABLE");
        novaTabela.setAttribute("id", "commiti");
        
        divEl = divElement;
        kreirajMatricu(brojZadatka);
        crtajTabelu();
        divEl.append(novaTabela);
        
        return{
            dodajCommit:function(rbZadatka,url)
            {
                dodajZadatak(rbZadatka, url);
                crtajTabelu();
            },
            obrisiCommit:function(rbZadatka,rbCommita)
            {
                var a = obrisiKomit(rbZadatka, rbCommita);
                if (a === -1)
                    return -1;
                crtajTabelu();
            },
            editujCommit:function(rbZadatka,rbCommita,url)
            {
                var a = editujKomit(rbZadatka,rbCommita,url);
                crtajTabelu();
                if(a === -1)
                    return -1;
            }
        }
    };
    
    return konstruktor;
}());