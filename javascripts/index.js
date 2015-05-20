var fs = require('fs');
var accountTemplate = fs.readFileSync('./templates/account.template', 'utf-8');
var domainTemplate = fs.readFileSync('./templates/domain.template', 'utf-8');
var domainNameTemplate = fs.readFileSync('./templates/domainName.template', 'utf-8');
var gui = require('nw.gui');
var DataStore = require('nedb');

var db = {};
db.domains = new DataStore({filename: './db/domains.json', autoload: true }); 
db.accounts = new DataStore({filename: './db/accounts.json', autoload: true }); 

var replaceDomainTemplateWithValues = function(template, domain) {
	var temp = template.replace("@ID@",domain._id);
	temp = temp.replace("@NAME@",domain.name);
	return temp;
}

var displayDomainName = function(domainId) {
	db.domains.find({_id:domainId}, function(domainError, domain) {
		domainError && alert("Error: "+domainError);
		var template = replaceDomainTemplateWithValues(domainNameTemplate, domain[0]);
		$("#domainName").html(template);
	});
}

var replaceAccountTemplateWithValues = function(accountTemplate, account) {
	var temp = accountTemplate.replace("@TYPE@",account.name);
	temp = temp.replace("@USERNAME@",account.userName);
	temp = temp.replace("@PASSWORD@",account.password);
	return temp;
}

var displayAccount = function(account) {
	var template = replaceAccountTemplateWithValues(accountTemplate, account);
	$("#accounts").append(template);
}

var displayDomainDetails = function(domainId) {
	displayDomainName(domainId);
	db.accounts.find({domainId:domainId}, function(accountsError, accounts) {
		$("#accounts").html("");
		accounts.forEach(displayAccount);
	});
}

var displayDomainInList = function(domain) {
	var template = replaceDomainTemplateWithValues(domainTemplate, domain);
	$("#domains").append(template);
}

var loadDomainsList = function() {
	db.domains.find({}, function(domainError, domains) {
		domainError && alert("Error: "+domainError);
		$("#domains").html("");
		domains.forEach(displayDomainInList);
	});
}

var documentReady = function() {
	gui.Window.get().setMinimumSize(1000,500);
	loadDomainsList();
}

$(document).ready(documentReady);
