var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
const fs = require('fs');
const db = require('./baza/db.js');
const dbFJE = require('./baza/dbFJE');

//Ovo bi trebalo da kreira tabelu jednom i nikad vise.
db.sequelize.sync().then(function(){
    console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
}, function(){
    console.log("Problemi pri kreiranju tabele");
});

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/pdf',express.static('pdf'));

app.set('view engine', 'ejs');

app.post('/addGodina', urlencodedParser, function (req, res) {
    dbFJE.postojiGodina(req.body.nazivGod).then(function(){
        res.status(404);
        res.render('greska', {error: "Godina sa tim nazivom vec postoji."});
    }).catch(function(){
        dbFJE.dodajGodinu(req.body.nazivGod, req.body.nazivRepSpi, req.body.nazivRepVje);
        res.redirect('addGodina.html');
        res.end();
    });
});    

app.get('/godine', function(req, res){
    if(req.query.naziv == null){
        dbFJE.dajSveGodine().then(function(sveGodine){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(sveGodine);
        });
    }
    else
    {
        dbFJE.dajIdGodine(req.query.naziv).then(function(idGodine){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({id: idGodine}));
        })
    }
});

app.get('/zadatak', function(req, res){
    dbFJE.postojiZadatak(req.query.naziv + '.pdf').then(function(){
        fs.readFile('pdf/' + req.query.naziv + '.pdf', function(err, data){
            if(err){
                res.status(404);
                res.render('greska', {error: err});
            }
            res.contentType("application/pdf");
            res.send(data);
       });
    }).catch(function(){
        res.status(404);
        res.render('greska', {error: "Ne postoji fajl sa tim nazivom."});
    });
});

var storage = multer.diskStorage({
    destination: 'pdf/',
    filename: function (req, file, cb) {
        cb(null, req.body.naziv + '.pdf');
  }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        const fileTypes = /pdf/;
        const provjeraPDF = fileTypes.test(file.originalname);
        
        if(!provjeraPDF){
            cb('Nije .pdf fajl.');
        }
        dbFJE.postojiZadatak(req.body.naziv + '.pdf').then(function(){
            cb('Fajl sa tim nazivom vec postoji.');
        }).catch(function(){
            //OVDJE PROVJERI AKO POSTOJI U /pdf, onda ga obrisi
            //ako dodje ovdje znaci da ne postoji u bazi ali postoji u /pdf 
            //te ga treba izbrisati u pdf i dodati 
            //u suprotnom samo treba da ga dodati
            dbFJE.dodajZadatak(req.body.naziv + '.pdf', 'pdf/' + req.body.naziv + '.pdf');
            
            var json = {
                naziv: req.body.naziv + '.pdf',
                postavka: 'http://localhost:8080/pdf/' + req.body.naziv + '.pdf'
            }
            json = JSON.stringify(json);
            
            fs.writeFileSync('pdf/'+ req.body.naziv + 'Zad' + '.json', json);
        });
        return cb(null, true);
    }
}).single('postavka');


app.post('/addZadatak', urlencodedParser, function(req, res){
    upload(req, res, function(err){
        if(err){
            res.status(404);
            res.render('greska', {error: err});
            }
        else{
            res.redirect('addZadatak.html');
        }
        res.end();
    });
});

var oblikuj = function(pdfovi){
    var niz = [];
    var csv = "";
    var xml = "<? xml version=\"1.0\" encoding=\"UTF-8\"?><zadaci>";
    for(var i = 0; i < pdfovi.length; i++){
        var objekat = {
            naziv: pdfovi[i],
            postavka: 'pdf/' + pdfovi[i]
        };
        csv += pdfovi[i] + "," + 'pdf/' + pdfovi[i];
        xml += "<zadatak>";
        xml += "<naziv> " + pdfovi[i] + " </naziv>";
        xml += "<postavka> pdf/" + pdfovi[i] + " </postavka>";
        xml += "</zadatak>";
        if(i != pdfovi.length-1)
            csv += '\n';
        niz.push(objekat);
    }
    xml += "</zadaci>";
    var sviOblici = {};
    sviOblici.json = JSON.stringify(niz);
    sviOblici.csv = csv;
    sviOblici.xml = xml;
    return sviOblici;
}

app.get('/zadaci', function(req, res){
    if(req.query.sVjezbe != null)
    {
        dbFJE.dajNepovezaneZadatke(req.query.sVjezbe).then(function(zadaciJSON){
            res.contentType('application/json');
            res.end(zadaciJSON);
        })
    }
    else{
        var pdfovi = [];
        dbFJE.dajSveZadatke().then(function(zadaci){
            var zadaciJSON = JSON.parse(zadaci);
            zadaciJSON.forEach(function(zadatak){
                pdfovi.push(zadatak.naziv);
            })
            //Ako hoce JSON kao odgovor, ide ova linija
            if(req.accepts('application/json')){
                res.contentType('application/json');
                res.end(oblikuj(pdfovi).json);
            }
            //Ako hoce XML
            else if(req.accepts('application/xml')){
                res.contentType('application/xml');
                res.end(oblikuj(pdfovi).xml);
            }
            //Ako hoce odgovor csv
            else {
                res.contentType('application/csv');
                res.end(oblikuj(pdfovi).csv);
            }
        })
    }
});

app.get('/vjezbe', function(req, res){
    if(req.query.naziv == null){
        dbFJE.dajSveVjezbe().then(function(vjezbeJSON){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(vjezbeJSON);
        });
    }
    else{
        dbFJE.dajIdVjezbe(req.query.naziv).then(function(idVjezbe){
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify({id: idVjezbe}));
        })
    }
});

app.post('/addVjezba', urlencodedParser, function (req, res) {
    console.log("prvi ispis: " + req.body.tekst + " // " + req.body.sGodine + " // " + req.body.sVjezbe);
    if(req.body.tekst != undefined && req.body.sGodine != undefined)
    {
        dbFJE.postojiVjezba(req.body.tekst).then(function(){
            res.status(404);
            res.render('greska', {error: "Vjezba sa tim nazivom vec postoji."});
        }).catch(function(){
            var spirala;
            if(req.body.spirala === undefined) spirala = false;
            else spirala = true;
            dbFJE.dodajVjezbu(req.body.tekst, spirala).then(function(neka){
                dbFJE.dodajVezuGodinaVjezba(req.body.sGodine, req.body.tekst)
            }).catch(function(error){
                console.log(error);
            });
            console.log(req.body.tekst, req.body.sGodine, spirala);
            res.redirect("/addVjezba.html");
        });
    }
    else if(req.body.sGodine != undefined || req.body.sVjezbe != undefined)
    {
        {
            dbFJE.dodajVezuGodinaVjezba(req.body.sGodine, req.body.sVjezbe);
            res.redirect("/addVjezba.html");
        }
    }
    else res.render('greska', {error: "Mora postojati godina da bi se dodala vjezba"});
});

app.post('/vjezba/:idVjezbe/zadatak', urlencodedParser, function (req, res) {
    dbFJE.dodajVezuVjezbaZadatak(req.params.idVjezbe, req.body.sZadatak);
    res.end();
})

var upisiNaGodinu = function(index, godina, upisanihNaGodinu, dodanUBazu, resolve){
    //treba provjera je li vec upisan na godinu
    //dodanUBazu = 0 => vec je upisan na godinu
    dbFJE.upisanNaGodinu(index).then(function(){
        resolve(JSON.stringify({dodanUBazu: dodanUBazu, upisanNaGodinu: 0}));
    }).catch(function(){
        dbFJE.upisiStudentaNaGodinu(index, godina).then(function(){
            upisanihNaGodinu.upisanih++;
            resolve(JSON.stringify({dodanUBazu: dodanUBazu, upisanNaGodinu: 1}));
        })
    })
}

app.post("/student", urlencodedParser, function(req, res){
    var godina = req.body[0].godina;
    var studentiPRVA = req.body[1].studenti;
    var novihUBazi = 0;
    var upisanihNaGodinu = {upisanih : 0};
    var obecanja = [];
    
    const studenti = []
    studentiPRVA.forEach((value) => {
        if (!studenti.some(x=> (x.index === value.index))) 
        {
            studenti.push(value)
        }
    })

    studenti.forEach(element => {
        obecanja.push(new Promise(function(resolve, reject){
            var imeStudenta = element.imePrezime;
            var index = element.index;
            console.log(element);
            dbFJE.postojiStudent(index).then(function(){
                upisiNaGodinu(index, godina, upisanihNaGodinu, 0, resolve);
            }).catch(function(){
                dbFJE.dodajStudenta(imeStudenta, index).then(function(){
                    novihUBazi++;
                    upisiNaGodinu(index, godina, upisanihNaGodinu, 1, resolve);
                })
            })   
        }))
    });
    
    Promise.all(obecanja).then(function(values){
        console.log(values);
        dbFJE.dajNazivGodine(godina).then(function(naziv){
            var n = 0;
            var m = 0;
            for(var i = 0; i < values.length; i++)
            {
                n += JSON.parse(values[i]).dodanUBazu;
                m += JSON.parse(values[i]).upisanNaGodinu;
            }
            res.end(JSON.stringify({message: "Dodano je " + n + " novih studenata i upisano " + m + " na godinu " + naziv}));
        })

    })
})

app.listen(8080);