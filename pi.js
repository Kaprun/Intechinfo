"use strict";

var http = require("http");
var url = require("url");
var querystring = require("querystring");

//-------------------------------------------------------------------------
// DECLARATION DES DIFFERENTS MODULES CORRESPONDANT A CHAQUE ACTION
//-------------------------------------------------------------------------

var req_commencer = require("./req_commencer.js");
var req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
var req_inscrire = require("./req_inscrire.js");
var req_identifier = require("./req_identifier.js");
var req_juju = require("./req_juju.js");
var req_ex = require("./Exemple.js");
var req_static = require("./req_static.js");
var req_erreur = require("./req_erreur.js");

//-------------------------------------------------------------------------
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
            case '/req_juju':
                req_juju(req, res, query);
                break;
            case '/req_afficher_formulaire_inscription':
                req_afficher_formulaire_inscription(req, res, query);
                break;
                case '/req_commencer':
                req_commencer(req, res, query);
                break;
            case '/req_inscrire':
                req_inscrire(req, res, query);
                break;
            case '/req_identifier':
                req_identifier(req, res, query);
                break;
            case '/exmple':
                req_ex(req, res, query);
                break;
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
var port = 8080;

// Chargement de socket.io
var io = require('socket.io').listen(mon_serveur);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.on('test', function(pseudo,text) {
        console.log(text);
        socket.emit('message', pseudo,text);
        socket.broadcast.emit('message', pseudo, text);

    });
});
console.log("Serveur en ecoute sur port 127.0.0.1: " + port);
mon_serveur.listen(port);
