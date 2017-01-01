"use strict";

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

    var marqueurs;
    var page;

    // AFFICHAGE DE LA PAGE D'ACCUEIL

    page = fs.readFileSync('index.html', 'utf-8');

    marqueurs = {};
    marqueurs.variable1 = "JE SAIS PAS QUI";
    marqueurs.variable2 = "ENCORE UNE VARIABLE";
    page = page.supplant(marqueurs);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(page);
    res.end();
};
//--------------------------------------------------------------------------

module.exports = trait;