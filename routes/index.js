var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');
var commentController = require('../controllers/comment_controller.js');
var sessionController = require('../controllers/session_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Quiz', errors: []});
});

// Autoload de comandos con quizId
router.param('quizId', quizController.load);
// Autoload :commentId
router.param('commentId', commentController.load);

/* Rutas de sesión */
router.get('/login',	sessionController.new);
router.post('/login',	sessionController.create);
router.get('/logout',	sessionController.destroy);

/* Rutas de Quizes */
router.get('/quizes',												quizController.index);
router.get('/quizes/:quizId(\\d+)',					quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);
router.get('/quizes/new',										sessionController.loginRequired, quizController.new);
router.post('/quizes/create',								sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',		sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',					sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',			sessionController.loginRequired, quizController.destroy);

/* Rutas de comentarios */
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', 		commentController.create);
// Mal, debería r con put
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	sessionController.loginRequired, commentController.publish);

/* GET credits page */
router.get('/author',function(req,res){
	res.render('author.ejs', {title: 'Créditos', errors: [] });
});

/* Ruta de estadísticas */
router.get('/quizes/statistics', quizController.statistics);

module.exports = router;
