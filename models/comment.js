
module.exports = function(sequelize,DataTypes){
	return sequelize.define('comment',{
		texto: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: 'Introduzca un comentario'}}
		}
	});
};