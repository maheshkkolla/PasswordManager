var fs = require('fs');
var accountTemplate = fs.readFileSync('./templates/account.template', 'utf-8');
var domainTemplate = fs.readFileSync('./templates/domain.template', 'utf-8');
var gui = require('nw.gui');
var DataStore = require('nedb');

var db = {};
db.domains = new DataStore({filename: './db/domains.json', autoload: true }); 
db.accounts = new DataStore({filename: './db/accounts.json', autoload: true }); 


var displayDomainInList = function(domain) {
	var template = domainTemplate;
	template = template.replace("@ID@",domain._id);
	template = template.replace("@NAME@",domain.name);
	$("#domains").append(template);
}

var loadDomainsList = function() {
	db.domains.find({}, function(domainError, domains) {
		domainError && alert("Error: "+domainError);
		domains.forEach(displayDomainInList);
	});
}

var documentReady = function() {
	gui.Window.get().setMinimumSize(1000,500);
	loadDomainsList();
}

$(document).ready(documentReady);
