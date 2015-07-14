var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Quiz' });
});

/* Rutas de Quizes */
router.get('/quizes',quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

/* GET credits page */
router.get('/author',function(req,res){
	res.render('author.ejs', {title: 'Créditos' });
});

module.exports = router;
