"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var pseudo;
    var password;
    var page;
    var admin;
    var contenu_fichier;
    var listeMembres;
	var i;
    var trouve;
	var listeUtilisateur;
	var user;
	// ON LIT LES COMPTES EXISTANTS

    contenu_fichier = fs.readFileSync("admin.json", 'utf-8');    
	listeMembres = JSON.parse(contenu_fichier);

    // ON VERIFIE QUE LE PSEUDO/PASSWORD EXISTE

    trouve = false;
    i = 0;
    while(i<listeMembres.length && trouve === false) {
        if(listeMembres[i].pseudo === query.pseudo) {
            if(listeMembres[i].password === query.password) {
                trouve = true;
        }
        i++;
    }
	}

    // ON RENVOIT UNE PAGE HTML 

    if(trouve === false) {
        // SI IDENTIFICATION INCORRECTE, ON REAFFICHE PAGE ACCUEIL AVEC ERREUR

        page = fs.readFileSync('modele__accueiladmin.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : compte ou mot de passe incorrect";
        marqueurs.pseudo = query.pseudo;
        page = page.supplant(marqueurs);

    } else {
        // SI IDENTIFICATION OK, ON ENVOIE PAGE ACCUEIL MEMBRE

        page = fs.readFileSync('modele_accueil_admin.html', 'UTF-8');
		
		marqueurs = {};
		marqueurs.pseudo = query.pseudo;
		page = page.supplant(marqueurs);
		} 
		contenu_fichier = fs.readFileSync("membres.json", 'utf-8');
		listeMembres = JSON.parse(contenu_fichier);
		marqueurs.listeUtilisateur = "";

			for(i = 0; i < listeMembres.length; i++)
			{
			listeUtilisateur = fs.readFileSync("membres.json");
			marqueurs.listeUtilisateur += '<br><button name="supp" value="">Utilisateur</button> '+listeMembres[i].pseudo+ ''
			}		
			page = page.supplant(marqueurs);
	res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(page);
    res.end();
};

//---------------------------------------------------------------------------

module.exports = trait;
