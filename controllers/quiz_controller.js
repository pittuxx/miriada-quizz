var models = require('../models/models.js');

//Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function(req,res,next,quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(
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

//GET /quizes/statistics
exports.statistics = function(req,res){
	var statisticsObject = {};

	models.Quiz.findAll().then(
		function(quizAmount){
			statisticsObject.numQuizes = quizAmount.length;

			models.Comment.findAll()
				.then(function(Comments){
					statisticsObject.numCommentsPublicados = 0;
					for(var i=0; i<Comments.length;i++){
						if(Comments[i].publicado === true){
							statisticsObject.numCommentsPublicados += 1;
						}
					}
					statisticsObject.mediaComments = statisticsObject.numCommentsPublicados / statisticsObject.numQuizes;

					models.Quiz.findAll({
							include: [{model: models.Comment, required: true }]
						}).then(function(conComments){
							statisticsObject.siComments = conComments.length;
							statisticsObject.noComments = statisticsObject.numQuizes - statisticsObject.siComments;

							res.render('quizes/statistics',{
								object: statisticsObject,
								errors: []
							});
						}
					).catch(function(error){next(error)});
				}
			).catch(function(error){next(error)});
		}
	).catch(function(error){next(error)});
};