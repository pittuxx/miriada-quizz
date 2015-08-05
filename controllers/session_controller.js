//GET login --formlario de login
exports.new = function(req,res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

//POST login --crea la sesión
exports.create = function(req,res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.authenticate(login,password,function(error,user){
		if(error) {
			req.session.errors = [{'message': '' + error}];
			res.redirect('/login');
			return;
		}

		//crear req.session.user y fuardar campos id y username
		//la sesión se define por la existencia de: req.session.user
		req.session.user = {id: user.id, username: user.username};
		//redirección al path anterior al login
		res.redirect(req.session.redir.toString());
	});
}

exports.destroy = function(req,res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());
};