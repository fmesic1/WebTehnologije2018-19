var BitBucket = (function(){
    var konstruktor = function(key, secret){
        return {
            ucitaj : function(nazivRepSpi, nazivRepVje, cb){
                var niz1=[];
                niz1.push({
                    imePrezime: "Mujo Mujic",
                    index: "17495"
                });
                niz1.push({
                    imePrezime: "Pero Peric",
                    index: "17494"
                });
                niz1.push({
                    imePrezime: "Haso Hasic",
                    index: "17493"
                });
                niz1.push({
                    imePrezime: "Dervo Botic",
                    index: "17492"
                });
                niz1.push({
                    imePrezime: "POSTOJECI INDEX",
                    index: "17492"
                });
                niz1.push({
                    imePrezime: "POSTOJECI INDEX 2",
                    index: "17492"
                });
                niz1.push({
                    imePrezime: "POSTOJECI INDEX 3",
                    index: "17492"
                });
                niz1.push({
                    imePrezime: "Domagoj Odmagoj",
                    index: "15123"
                });
                niz1.push({
                    imePrezime: "Robert Dokloc",
                    index: "18634"
                });
                niz1.push({
                    imePrezime: "Leblanc",
                    index: "17634"
                });
                niz1.push({
                    imePrezime: "Vayne i Goodbye",
                    index: "17321"
                });
                niz1.push({
                    imePrezime: "Yasuo 4TheWin",
                    index: "18222"
                });

                return JSON.stringify(niz1);
            }
        }
    }
    return konstruktor;
}());
    