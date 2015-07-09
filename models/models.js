var path = require('path');

//Cargando ORM
var Sequelize = require('sequelize');

//Usando BBDD
var sequelize = new Sequelize(null, null, null,
											{dialect: 'sqlite', storage: "quiz.sqlite"}
										);

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; //Exportar la definición de la tabla Quiz

//sequelize.sync() crea e inicializa tabla de pregutas en DB
sequelize.sync().success(function(){
	Quiz.count().success(function(count){
		if(count===0) {
			Quiz.create({	pregunta:'Capital de Italia',
										respuesta: 'Roma'
									})
			.success(function(){console.log('Base de datos inicializada')});
		};
	});
});