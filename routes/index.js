var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Quiz' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/* GET credits page */
router.get('/author',function(req,res){
	res.render('author.ejs', {title: 'Créditos' });
});

module.exports = router;
