var DataStore = require('nedb');
var gui = require('nw.gui');
var db = {};
db.domains = new DataStore({filename: './db/domains.json', autoload: true }); 
db.accounts = new DataStore({filename: './db/accounts.json', autoload: true }); 

var checkForSetUpOrLogin = function() {
	
	db.domains.find({_id:'1'}, function(err, thisAccount) {
		err && alert("Error: "+err);
		if(thisAccount.length == 0) $('#signUpModal').modal('show');
		else $("#loginModal").modal('show');
	});
}

var validateSetPassword = function(password, confirmPassword){
	var errMsg = "";
	(password!=confirmPassword) &&  (errMsg = "Password miss matched");
	(password.length<5) &&  (errMsg = "Password must contain more than 5 characters");
	(password=="" || confirmPassword=="") &&  (errMsg = "Fields Cannot be empty");

	if(errMsg == "") return true;
	$("#signUpErrMsg").text(errMsg);
	return false;
}

var setPassword = function() {
	var password = $("#firstPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	if(validateSetPassword(password,confirmPassword)){
		var encrptedPassword = new Buffer(password).toString('base64');
		var domainRecord = {_id:'1', name:"Password Manger"};
		var accountRecord = {_id:'1', name:"Desktop App", description:"",userName:"",password:encrptedPassword,domainId:'1'};
		db.domains.insert(domainRecord, function(domainError, result) {
			domainError && alert("Error at inserting "+JSON.stringify(domainError));
			db.accounts.insert(accountRecord, function(accountError,row) {
				accountError && alert("Error at inserting "+JSON.stringify(accountError));
				$('#signUpModal').modal('hide');
				$('#loginModal').modal('show');
			});
		});		
	}
}

var doLogin = function() {
	var password = $("#password").val();
	db.accounts.find({_id:'1'}, function(err, record) {
		err && alert("Error:"+err);
		var encrptedPassword = new Buffer(password).toString('base64');
		if(record[0].password == encrptedPassword){
			gui.Window.open("./index.html");
			gui.Window.get().close();
		} else $("#loginErrMssg").text("Invalid Password");
	});
}

$(document).ready(checkForSetUpOrLogin);