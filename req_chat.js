"use strict"

var fs = require("fs");
require('remedial');

var trait = function (req, res, query) {

	var page;
	 
	 // AFFICHAGE DE LA PAGE CHAT

	 page = fs.readFileSync('modele_chat.html', 'utf-8');

//	 page = page.supplant(marqueurs);

	 res.writeHead(200, {'Content-Type': 'text/html'});
	 res.write(page);
	 res.end();
};

module.exports = trait;
