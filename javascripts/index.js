var fs = require('fs');
var accountTemplate = fs.readFileSync('./templates/account.template', 'utf-8');
var domainTemplate = fs.readFileSync('./templates/domain.template', 'utf-8');
var domainNameTemplate = fs.readFileSync('./templates/domainName.template', 'utf-8');
var gui = require('nw.gui');
var DataStore = require('nedb');

var db = {};
db.domains = new DataStore({filename: './db/domains.json', autoload: true }); 
db.accounts = new DataStore({filename: './db/accounts.json', autoload: true }); 

var showNotes = function(notes) {
	$(event.target).popover({
		title:'Notes',
		trigger: 'hover',
		content:notes,
		html:true,
	});
	$(event.target).popover("show");
}

var hidePasswordAgain = function(element) {
	$(element).text("Show Password");
	$(element).attr('class','btn btn-default');
}

var formatShowPasswordButton = function(element, password) {
	$(element).text(password);
	$(element).attr('class','btn btn-danger');
	setTimeout(function() {
		hidePasswordAgain(element);
	},5000);
}

var showPassword = function(id) {
	var element = event.target;
	db.accounts.findOne({_id:id}, function(error, account) {
		error && alert("Error:"+error);
		var password = new Buffer(account.password,"base64");
		formatShowPasswordButton(element,password);
	});
}


var searchDomains = function() {
	var keyword = $('#domainSearch').val();
	db.domains.find({name:new RegExp(keyword,"i")}, function(domainError, domains) {
		domainError && alert("Error:"+domainError);
		$("#domains").html("");
		domains.forEach(displayDomainInList);
	});
}

var replaceDomainTemplateWithValues = function(template, domain) {
	var temp = template.replace(/@ID@/g,domain._id);
	temp = temp.replace(/@NAME@/g,domain.name);
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
	var temp = accountTemplate.replace(/@ID@/g,account._id);
	temp = temp.replace(/@TYPE@/g,account.name);
	temp = temp.replace(/@USERNAME@/g,account.userName);
	temp = temp.replace(/@NOTES@/g,account.notes);
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
