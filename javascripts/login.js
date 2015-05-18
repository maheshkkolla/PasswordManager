var DataStore = require('nedb');
var gui = require('nw.gui');
var db;

var checkForSetUpOrLogin = function() {
	db = new DataStore({filename: './db/accounts.json', autoload: true }); 
	db.find({_id:1}, function(err, thisAccount) {
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
		var record = {_id:1, account:"Password Manger", userName:"", password:password};
		db.insert(record, function(err, result) {
			err && alert("Error at inserting"+err);
			$('#signUpModal').modal('hide');
			$('#loginModal').modal('show');
		});		
	}
}

var doLogin = function() {
	var password = $("#password").val();
	db.find({_id:1}, function(err, record) {
		err && alert("Error:"+err);
		console.log("Pas:",password,"re:",record);
		if(record[0].password == password){
			gui.Window.open("./index.html");
			gui.Window.get().close();
		} else $("#loginErrMssg").text("Invalid Password");
	});
}

$(document).ready(checkForSetUpOrLogin);