var models = require('../models/models.js');

//Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if(quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId = ' + quizId));}
		}
	).catch(function(error){next(error);});
};

//GET /quizes/index
exports.index = function(req,res){
	var search = req.query.search;
	if(search) {
		search = '%' + search.replace(' ', '%','g') + '%';
		models.Quiz.findAll({where: ["pregunta LIKE ?", search]}).then(function(quizes){
			//res.render('quizes/search');
				res.render('quizes/index',{quizes: quizes});			
		}).catch(function(error){next(error);})
	} else {
		models.Quiz.findAll().then(function(quizes){
				res.render('quizes/index',{quizes: quizes});
		}).catch(function(error){next(error);})
	}
};


//GET /quizes/question
exports.show = function(req,res){
	res.render('quizes/show', {quiz: req.quiz})
};

//GET /quizes/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};





//GET /quizes/question
//exports.question = function(req, res){
//	res.render('quizes/question', {pregunta: 'Capital de Italia'});
//};

//GET /quizes/answer
//exports.answer = function(req, res){
//	if (req.query.respuesta === 'Roma'){
//		res.render('quizes/answer', {respuesta: 'Correcto'});
//	} else {
//		res.render('quizes/answer', {respuesta: 'Incorrecto'});
//	}
//};