var fs = require('fs');
var accountTemplate = fs.readFileSync('./account.template', 'utf-8');
var gui = require('nw.gui');
var DataStore = require('nedb');

var db = {};
db.domains = new DataStore({filename: './db/domains.json', autoload: true }); 
db.accounts = new DataStore({filename: './db/accounts.json', autoload: true }); 

var displayAccountOf = function(account, domain) {
	var template = accountTemplate;
	template = template.replace("@DOMAIN@", domain.name);
	template = template.replace("@ACCOUNT@", account.name);
	template = template.replace("@DESCRIPTION@", account.description);
	template = template.replace("@USERNAME@", account.userName);
	$('#accounts').append(template);

}

var displayAccountsOf = function(domain) {
	db.accounts.find({domainId: domain._id}, function(accountsError, accounts) {
		accountsError && alert("Error:"+accountsError);
		accounts.forEach(function(account){
			displayAccountOf(account, domain);
		});
	});
}

var loadAllAccounts = function() {
	db.domains.find({}, function(domainError, domains) {
		domainError && alert("Error:"+ domainError);
		domains.forEach(displayAccountsOf);
	});
}

var documentReady = function() {
	gui.Window.get().setMinimumSize(1000,500);
	loadAllAccounts();
}

$(document).ready(documentReady);
