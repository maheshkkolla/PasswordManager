var fs = require('fs');
var accountTemplate = fs.readFileSync('./account.template', 'utf-8');
var domainTemplate = fs.readFileSync('./domain.template', 'utf-8');
var gui = require('nw.gui');
var DataStore = require('nedb');

var db = {};
db.domains = new DataStore({filename: './db/domains.json', autoload: true }); 
db.accounts = new DataStore({filename: './db/accounts.json', autoload: true }); 


var documentReady = function() {
	gui.Window.get().setMinimumSize(1000,500);
}

$(document).ready(documentReady);
