"use strict";

var fs = require("fs");
require ("remedial");


var suppression = function (req, res, query) {

	var marqueurs;
	var commentaire;
    var password;
	var pseudo;
    var page;
    var contenu_fichier;
    var listeMembres;
    var i;
    var trouve;i
	var removed;

    contenu_fichier = fs.readFileSync("membres.json", 'utf-8');
    listeMembres = JSON.parse(contenu_fichier);


    trouve = false;
    i = 0;
    while(i<listeMembres.length && trouve === false) {
	  if(listeMembres[i].pseudo === query.pseudosupprimer) {
			 listeMembres.splice(i, 1);
					contenu_fichier = JSON.stringify(listeMembres);
					fs.writeFileSync("membres.json", contenu_fichier, 'utf-8');

        	trouve = true;
					page = fs.readFileSync("modele_supprimer.html", 'utf-8');

					marqueurs = {};
					marqueurs.pseudo = query.pseudo;
					page = page.supplant(marqueurs);
				} else {
					page = fs.readFileSync("modele_supprimer.html", 'utf-8');

					marqueurs = {};
					marqueurs.erreur = "Vous avez fait une erreur ! Recommencez s'il vous plait.";
					marqueurs.pseudo = query.pseudo;
					marqueurs.commentaire = commentaire;
					page = page.supplant(marqueurs);
				}
			i++;
		}

res.writeHead(200, {'Content-Type': 'text/html'});
res.write(page);
res.end();

};

module.exports = suppression;