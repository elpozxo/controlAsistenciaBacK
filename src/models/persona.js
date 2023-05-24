const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Persona = sequelize.define("Persona", {
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tipoDocumento: {
    type: DataTypes.ENUM("Cedula", "Tarjeta", "Otro"),
    allowNull: false,
  },
  primerNombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  primerApellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexo: {
    type: DataTypes.ENUM("Masculino", "Femenino", "Prefiero no decirlo"),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});
Persona.sync().then(() => {
    console.log('Tabla de personas creada en la base de datos');
  });
module.exports = Persona;
