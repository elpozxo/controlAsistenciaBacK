const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const controlAsistencia = sequelize.define("controlAsistencia", {
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  fechaEvento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  tipoEvento: {
    type: DataTypes.ENUM("Ingreso", "Salida"),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
}); 
controlAsistencia.sync().then(() => {
    console.log('Tabla de controlAsistencia creada en la base de datos');
  });
module.exports = controlAsistencia;
