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
			res.render('quizes/index',{quizes: quizes, errors: []});			
		}).catch(function(error){next(error);})
	} else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes/index',{quizes: quizes, errors: []});
		}).catch(function(error){next(error);})
	}
};


//GET /quizes/question
exports.show = function(req,res){
	res.render('quizes/show', {quiz: req.quiz, errors: []})
};

//GET /quizes/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};


//GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build(
		{pregunta: 'pregunta', respuesta: 'respuesta', tema: ''}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};


//POST /quizes/create
exports.create = function(req,res){
	var quiz = models.Quiz.build(req.body.quiz);

	//Guarda en la DB los campos pregunta y respuesta
	quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  );
}; 


//GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};


//PUT /quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else{
				req.quiz
				.save(
					{
						fields: ["pregunta","respuesta","tema"]
					}
				)
				.then(function(){
					res.redirect('/quizes');
				});
			}
		}
	)
};


//DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){ next(error) });
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