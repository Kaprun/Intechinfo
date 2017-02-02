"use strict";
var fs = require("fs");
var http = require('http');
var url = require('url');

var trait = function (req, res, query) {

contenu_fichier = fs.readFileSync("inventaire.json", 'utf-8');    
listinventaire = JSON.parse(contenu_fichier);


listinventaire.forEach(function(element) {
  
  console.log("vous avez : " + element.nameobjet);
  console.log("et vous en avez : " + element.nb);
});


    //parse the url and query string from the request 
    var url_parts = url.parse(req.url, true);

    //if the callback query parameter is set, we return the string (or object)
    
        var str = "Hi man";
       // res.writeHead(200, {'Content-Type':'text/html'});
        //res.end(url_parsed.query.callback+'("'+str+'")');
        res.writeHead(200, {'Content-Type': 'text/html'});

    res.write('ERREUR SERVEUR');

    res.end();
   //if it's not set, let's return a 404 error
    
};




/*var inventaire = [];

var item = {};
item.nameobjet = "tutu";
item.nb = 10;
item.user = "toto";

var item2= {};
item2.nameobjet = "tutu";
item2.nb = 10;

inventaire.push(item);
inventaire.push(item2);



var contenustring = JSON.stringify(inventaire);


fs.writeFileSync("inventaire.json", contenustring, 'utf-8');*/
module.exports = trait;
