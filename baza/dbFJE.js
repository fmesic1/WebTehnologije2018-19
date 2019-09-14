const db = require('./db');

module.exports = {
    dodajZadatak : function(naziv, postavka){
        return new Promise(function(resolve, reject){
            db.zadatak.create({naziv:naziv, postavka:'http://localhost:8080/' + postavka});  
        });
    },

    moja : function(){
        console.log("KAKO ZNA DA IGRA, KAD IGRA BLEFIRA");
    },

    postojiZadatak : function(naziv){
        return new Promise(function(resolve, reject){
            db.zadatak.count({where : {naziv : naziv}}).then(function(brojPostojecih){
                if(brojPostojecih != 0)
                    resolve();
                reject();
            })
        });
    },

    postojiGodina : function(nazivGod){
        return new Promise(function(resolve, reject){
            db.godina.count({where : {nazivGod : nazivGod}}).then(function(brojPostojecih){
                if(brojPostojecih != 0)
                    resolve();
                reject();
            })
        })
    },

    dodajGodinu : function(nazivGod, nazivRepSpi, nazivRepVje){
        return new Promise(function(resolve, reject){
            //db.zadatak.create({naziv:naziv, postavka:postavka});
            db.godina.create({nazivGod: nazivGod, nazivRepSpi : nazivRepSpi, nazivRepVje : nazivRepVje});           
        });
    },

    dodajVjezbu : function(naziv, spirala){
        return new Promise(function(resolve, reject){
            //db.zadatak.create({naziv:naziv, postavka:postavka});
            db.vjezba.create({naziv: naziv, spirala: spirala}).then(function(){
                resolve();
            }).catch(function(error){
                reject("vjezba: '" + naziv + "' nije dodana");
            });           
        });
    },

    postojiVjezba : function(naziv){
        return new Promise(function(resolve, reject){
            db.vjezba.count({where : {naziv : naziv}}).then(function(brojPostojecih){
                if(brojPostojecih != 0)
                    resolve();
                reject();
            })           
        })
    },

    dajSveGodine : function(){
        return new Promise(function(resolve, reject){
            db.godina.findAll().then(function(sviZadaci){
                var vrati = [];
                sviZadaci.forEach(function(zadatak){
                    var objekat = {nazivGod : zadatak.nazivGod, 
                                   nazivRepSpi : zadatak.nazivRepSpi, 
                                   nazivRepVje : zadatak.nazivRepVje
                                };
                    vrati.push(objekat);
                });
                resolve(JSON.stringify(vrati));
            })
        });
    },

    dajSveZadatke : function(){
        return new Promise(function(resolve, reject){
            db.zadatak.findAll().then(function(sviZadaci){
                var vrati = [];
                sviZadaci.forEach(function(zadatak){
                    vrati.push({naziv: zadatak.naziv, postavka: zadatak.postavka});
                });
                resolve(JSON.stringify(vrati));
            });
        });
    },

    dajSveVjezbe : function(){
        return new Promise(function(resolve, reject){
            db.vjezba.findAll().then(function(sveVjezbe){
                var vrati = [];
                sveVjezbe.forEach(function(vjezba){
                    vrati.push({naziv: vjezba.naziv, spirala: vjezba.spirala});
                });
                resolve(JSON.stringify(vrati));
            });
        });
    },

    dodajVezuGodinaVjezba: function(nazivGod, nazivVjezbe){
        return new Promise(function(resolve, reject){
            db.godina.findOne({where : {nazivGod: nazivGod}}).then(function(godina){
                db.vjezba.findOne({where : {naziv : nazivVjezbe}}).then(function(vjezba){
                    godina.addVjezbe(vjezba);
                })
            })
        })
    },

    dajNepovezaneZadatke: function(nazivVjezbe){
        return new Promise(function(resolve, reject){
            var vrati = [];
            var zadaci = [];
            db.zadatak.findAll().then(function(zadaciSvi){
                zadaciSvi.forEach(function(zadatakJedan){
                    zadaci.push({naziv : zadatakJedan.naziv});
                })
                db.vjezba.findOne({where: {naziv: nazivVjezbe}}).then(function(nadjenaVjezba){
                    nadjenaVjezba.getZadaci().then(function(povezaniZadaci){
                        povezaniZadaci.forEach(function(zadatak){
                            var objekat = {
                                naziv : zadatak.naziv
                            }
                            vrati.push(objekat);
                        })
                        var aBdVraceni = [];
                        zadaci.forEach(function(jedanZadatak){
                            let i;
                            for(i = 0; i < vrati.length; i++)
                                if(vrati[i].naziv == jedanZadatak.naziv)
                                    break;
                            if(i == vrati.length)
                            aBdVraceni.push({naziv: jedanZadatak.naziv});
                        })
                        resolve(JSON.stringify(aBdVraceni));
                    })
                }).catch(function(){
                    console.log("OOOOOOOOVVVVVVVVVVVDDDDDDDDDDJJJJJJEEEEEEEEE");
                    vrati = [];
                    resolve(JSON.stringify(vrati));
                })
            })
        });
    },

    dajIdVjezbe: function(nazivVjezbe){
        return new Promise(function(resolve, reject){
            db.vjezba.findOne({where : {naziv: nazivVjezbe}}).then(function(vjezba){
               resolve(vjezba.id);
            })
        });
    },

    dajIdGodine: function(nazivGodine){
        return new Promise(function(resolve, reject){
            db.godina.findOne({where : {naziv: nazivGodine}}).then(function(godina){
               resolve(godina.id);
            })
        });
    },

    dodajVezuVjezbaZadatak: function(idVjezbe, nazivZadatka){
        return new Promise(function(resolve, reject){
            db.vjezba.findOne({where : {id: idVjezbe}}).then(function(vjezba){
                db.zadatak.findOne({where : {naziv : nazivZadatka}}).then(function(zadatak){
                    zadatak.addVjezbe(vjezba);
                }).catch(function(){
                    console.log("nista od dodavanja");
                })
            })
        })
    },

    dodajStudenta : function(imePrezime, indeks){
        return new Promise(function(resolve, reject){
            db.student.create({imePrezime: imePrezime, index: indeks}).then(function(){
                resolve();
            });
        })
    },

    postojiStudent : function(index){
        return new Promise(function(resolve, reject){
            db.student.count({where : {index : index}}).then(function(brojPostojecih){
                if(brojPostojecih != 0)
                    resolve();
                reject();
            })
        });
    },
    
    upisiStudentaNaGodinu: function(indeks, godinaID){
        return new Promise(function(resolve, reject){
            db.godina.findOne({where : {id: godinaID}}).then(function(godina){
                db.student.findOne({where : {index : indeks}}).then(function(student){
                    godina.addStudenti(student);
                    resolve();
                })
            })
        })
    },

    upisanNaGodinu : function(index){
        return new Promise(function(resolve, reject){
            db.student.findOne({where: {index: index}}).then(function(studentTAJ){
                if (studentTAJ.studentGod == null)
                    reject();
                resolve();
            })
        })  
    },

    dajNazivGodine : function(id){
        return new Promise(function(resolve, reject){
            db.godina.findOne({where : {id : id}}).then(function(nadjena){
                resolve(nadjena.nazivGod);
            })
        })
    }
}