"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var pseudo;
    var password;
    var role;
	var page;
    var user;
    var contenu_fichier;
    var listeMembres;
    var i;
    var trouve;
	var listeinventaire;

    // ON LIT LES COMPTES EXISTANTS

   	contenu_fichier = fs.readFileSync("membres.json", 'utf-8');    

	listeMembres = JSON.parse(contenu_fichier);

    // ON VERIFIE QUE LE PSEUDO/PASSWORD/ROLE EXISTE

    trouve = false;
    i = 0;
    while(i<listeMembres.length && trouve === false) {
		if(listeMembres[i].pseudo === query.pseudo) {
            if(listeMembres[i].password === query.password) {
               if(listeMembres[i].role === query.role) {
			   trouve = true;
            }
        }
       }
		i++;
   
}
 
 listeinventaire = fs.readFileSync("inventaire.json", 'utf-8');

 // ON RENVOIT UNE PAGE HTML 

    if(trouve === false) {
        // SI IDENTIFICATION INCORRECTE, ON REAFFICHE PAGE ACCUEIL AVEC ERREUR

        page = fs.readFileSync('modele_accueil.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : l'un des identifiants est incorrect";
        marqueurs.pseudo = query.pseudo;
		marqueurs.role = query.role;
        page = page.supplant(marqueurs);


}	
	else {
        // SI IDENTIFICATION OK, ON ENVOIE PAGE ACCUEIL MEMBRE

        page = fs.readFileSync('modele_accueil_membre.html', 'UTF-8');

        marqueurs = {};
        marqueurs.pseudo = query.pseudo;
       	marqueurs.role = query.role;
	   	marqueurs.inventaire = listeinventaire;
	   page = page.supplant(marqueurs);
    }
			
			page = page.supplant(marqueurs);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(page);
    res.end();
};

//---------------------------------------------------------------------------

module.exports = trait;
