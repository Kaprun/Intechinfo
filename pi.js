"use strict";

var http = require("http");
var url = require("url");
var querystring = require("querystring");
var fs =require("fs");

//-------------------------------------------------------------------------
// DECLARATION DES DIFFERENTS MODULES CORRESPONDANT A CHAQUE ACTION
//-------------------------------------------------------------------------

var req_commencer = require("./req_commencer.js");

var req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
var req_inscrire = require("./req_inscrire.js");
var req_inscrire1 = require("./req_inscrire1.js");
var req_identifier = require("./req_identifier.js");
var req_inventaire = require("./req_inventaire.js");
var req_static = require("./req_static.js");
var req_erreur = require("./req_erreur.js");
var req_identifieradmin = require('./req_identifieradmin.js');
var req_supprimer = require("./req_supprimer.js");
var req_ajouter = require("./req_ajouter.js");
//var req_juju = require("./req_juju.js");
var req_chat = require("./req_chat.js");
//var app = require("./app.js");

// FONCTION DE CALLBACK APPELLEE POUR CHAQUE REQUETE
//-------------------------------------------------------------------------

var traite_requete = function (req, res) {

    var ressource;
    var requete;
    var pathname;;
    var query;

    console.log("URL reçue : " + req.url);
    requete = url.parse(req.url, true);
	pathname = requete.pathname;
	query = requete.query;

    // ROUTEUR

    try {
        switch (pathname) {
            case '/':
  //          case '/req_juju':
	//		      req_juju(req, res, query);
	//	        break;
			case '/req_commencer':
                req_commencer(req, res, query);
                break;
            case '/req_afficher_formulaire_inscription':
                req_afficher_formulaire_inscription(req, res, query);
                break;
            case '/req_inscrire':
                req_inscrire(req, res, query);
                break;
			case '/req_inventaire' : 
				req_inventaire(req, res, query);
				break;
         	case '/req_inscrire1':
				req_inscrire1(req, res, query);
				break;
            case '/req_supprimer' : 
                req_supprimer(req, res, query);
		 	case '/req_identifier':
                req_identifier(req, res, query);
                break;
			case '/req_identifieradmin':
			req_identifieradmin(req, res, query);
			break;
			case '/admin':
				admin(req, res, query);
            break;
			case '/req_ajouter':
			req_ajouter(req, res, query);
			break;
			case '/req_chat':
			req_chat(req, res, query);
			break;
//			case '/app' :
//			app(req, res, query);
//			break;
			default:
                req_static(req, res, pathname);
                break;
        }
    } catch (e) {
        console.log('Erreur : ' + e.stack);
        console.log('Erreur : ' + e.message);
        //console.trace();
        req_erreur(req, res, query);
    }
};

//-------------------------------------------------------------------------
// CREATION ET LANCEMENT DU SERVEUR
//-------------------------------------------------------------------------

var mon_serveur = http.createServer(traite_requete);
var port = 80;
var contenuBan;
var listBan;

// Chargement de socket.io
var io = require('socket.io').listen(mon_serveur);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    
    socket.on('test', function(pseudo,text) {
        if(GetCommand(text,pseudo))
        {
            var subcommand = "/arreter ";
            var pseudoArreter = text.replace(subcommand,"");
            if(GetMuted(pseudoArreter))
            {
                    AddDeleteArreter(pseudoArreter,false);
                    socket.emit('message', pseudo,pseudoArreter+ "est sortie de prison");
                    socket.broadcast.emit('message', pseudo,pseudoArreter+ " est sortie de prison");
            }
            else
            {
                    AddDeleteArreter(pseudoArreter,true);
                    socket.emit('message', pseudo,pseudoArreter+ " est en prison");
                    socket.broadcast.emit('message', pseudo,pseudoArreter+ " est en prison")
            }
        
        }
        else
        {

        
            if(!GetMuted(pseudo))
            {
                socket.emit('message', pseudo,text);
                socket.broadcast.emit('message', pseudo, text);
            }
            else
            socket.emit('message', pseudo,"Tu es en prison");
        }

    });

    function GetCommand(text ,pseudo)
{
    var subcommand = "/arreter ";

    if(text.includes(subcommand))
    {

        var contenu_fichier = fs.readFileSync("membres.json", 'utf-8');    
   var listeMembres = JSON.parse(contenu_fichier);

   for(var i = 0; i < listeMembres.length; i++)
   {
       if(listeMembres[i].pseudo == pseudo)
       {
           if(listeMembres[i].factionID != 1)
           {
               socket.emit('message', "serveur","pas l'autoriter pour faire ca");
            return false;
           }
       }
   }
        var pseudoArreter = text.replace(subcommand,"");
        pseudoArreter = pseudoArreter.replace(/\s/g, "");
        
        if(GetPseudoExist(pseudoArreter))
        {
        console.log("Pseudo arreter existe");
        
        return true;
        }
        else
        {
        console.log("Pseudo arreter existe pas");
        socket.emit('message', "serveur",pseudoArreter+" existe pas");
        return false;
        }
        
    }
    return false;
}

function GetPseudoExist(pseudo)
{
   var contenu_fichier = fs.readFileSync("membres.json", 'utf-8');    
   var listeMembres = JSON.parse(contenu_fichier);

   for(var i = 0; i < listeMembres.length; i++)
   {
       if(listeMembres[i].pseudo == pseudo)
       {
           return true;
       }
   }
}

function GetMuted(pseudo)
{
    var contenu_fichier = fs.readFileSync("arreter.json", 'utf-8');    
        var listeArreter = JSON.parse(contenu_fichier);
for(var i = 0; i < listeArreter.length;i++)
        {
            if(listeArreter[i].pseudo == pseudo)
            {
                console.log("muted");
            return true;
            }
            
        }

console.log("pas muted");
        return false;
}

function AddDeleteArreter(pseudo,arreter)
{
    if(arreter)
    {
        var contenu_fichier = fs.readFileSync("arreter.json", 'utf-8');    
        var listeArreter = JSON.parse(contenu_fichier);

        var arreternew = {};
        arreternew.pseudo = pseudo;

        listeArreter[listeArreter.length] = arreternew;

        contenu_fichier = JSON.stringify(listeArreter);

        fs.writeFileSync("arreter.json", contenu_fichier, 'utf-8');
    }
    else
    {
        var contenu_fichier = fs.readFileSync("arreter.json", 'utf-8');    
        var listeArreter = JSON.parse(contenu_fichier);

        for(var i = 0; i < listeArreter.length;i++)
        {
            if(listeArreter[i].pseudo == pseudo)
            listeArreter.splice(i,1);
            
        }

        contenu_fichier = JSON.stringify(listeArreter);

        fs.writeFileSync("arreter.json", contenu_fichier, 'utf-8');
    }
}
});
console.log("Serveur en ecoute sur port 127.0.0.1: " + port);
mon_serveur.listen(port);



