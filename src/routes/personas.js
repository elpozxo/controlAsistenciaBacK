const express = require("express");
const router = express.Router();
const Persona = require("../models/persona");
const { Op } = require("sequelize");
const response = {
  codigo: 0, //-1 mal; 0 ok;1 Warni
  mensaje: "",
  dato: [],
};
// Ruta para crear una nueva persona
router.post("/", async (req, res) => { 
  // Validar si el documento es un número
  if (isNaN(req.body.documento)) {
    response.mensaje = "Documento debe ser numero";
    response.codigo = 1;
    res.status(400).json(response);
    return;
  }
  try {
    const espersona = await Persona.findOne({
      where: { documento: req.body.documento },
    });
    if (espersona) {
      response.mensaje = "Este documento ya existe";
      response.dato = espersona;
      response.codigo = 1;
      res.status(201).json(response);
    } else {
      newpersona = await Persona.create(req.body);
      response.mensaje = "Persona creada exitosamente";
      response.dato = newpersona;
      response.codigo = 0;
      res.status(201).json(response);
    }
  } catch (error) {
    response.mensaje = error.message;
    response.dato = null;
    response.codigo = -1;
    res.status(400).json(response);
  }
});
// Ruta para actualizar una persona por su documento
router.put("/:documento", async (req, res) => {
  // Validar si el documento es un número
  if (isNaN(req.params.documento)) {
    response.mensaje = "Documento debe ser numero";
    response.codigo = 1;
    res.status(400).json(response);
    return;
  }
  try {
    const espersona = await Persona.findOne({
      where: { documento: req.params.documento },
    });
    if (espersona) {
      const { documento, ...actualizacion } = req.body;
      await espersona.update(actualizacion);
      response.mensaje = "Actualizo a " + req.params.documento;
      response.dato = espersona;
      response.codigo = 0;
      res.json(response);
    } else {
      response.mensaje = "Persona no existe";
      response.dato = null;
      response.codigo = 1;
      res.status(404).json(response);
    }
  } catch (error) {
    response.mensaje = error.message;
    response.dato = null;
    response.codigo = -1;
    res.status(400).json(response);
  }
});
// Ruta para eliminar una persona por su documento
router.delete("/:documento", async (req, res) => {
  // Validar si el documento es un número
  if (isNaN(req.params.documento)) {
    response.mensaje = "Documento debe ser numero";
    response.codigo = 1;
    res.status(400).json(response);
    return;
  }
  try {
    const persona = await Persona.findOne({
      where: { documento: req.params.documento },
    });
    if (!persona) {
      response.mensaje = "Persona no existe";
      response.dato = null;
      response.codigo = 1;
      return res.status(404).json(response);
    }
    response.mensaje = "Se elimino a " + persona.documento;
    response.dato = persona;
    response.codigo = 0;
    await persona.destroy();
    res.json(response);
  } catch (error) {
    response.mensaje = "Problemas en el servidor";
    response.dato = null;
    response.codigo = -1;
    res.status(500).json(response);
  }
});
// Ruta para obtener una persona por su documento
router.get("/:buscar/:valor", async (req, res) => {
  try {
    let personaBuscar = [];
    if(req.params.valor=="-1"){
      personaBuscar = await Persona.findAll();
    }
    else
    switch (req.params.buscar) {
      case "nombre":
        personaBuscar = await Persona.findAll({
          where: {
            primerNombre: {
              [Op.like]: `%${req.params.valor}%`,
            },
          },
        });
        break;
      case "apellido":
        personaBuscar = await Persona.findAll({
          where: {
            primerApellido: {
              [Op.like]: `%${req.params.valor}%`,
            },
          },
        });
        break;
      default:
        personaBuscar = await Persona.findAll({
          where: {
            documento: {
              [Op.like]: `%${req.params.valor}%`,
            },
          },
        });
        break;
    }
    if (personaBuscar) {
      response.mensaje = "Resultado de la busqueda " + req.params.valor;
      response.dato = personaBuscar;
      response.codigo = 0;
      res.json(response);
    } else {
      response.mensaje = "Persona no existe";
      response.dato = null;
      response.codigo = 1;
      res.status(404).json(response);
    }
  } catch (error) {
    response.mensaje = error.message;
    response.dato = null;
    response.codigo = -1;
    res.status(500).json(response);
  }
});
// Ruta para obtener todas las personas
router.get("/", async (req, res) => {
  try {
    const allpersonas = await Persona.findAll();
    response.mensaje = "Lista de persona";
    response.dato = allpersonas;
    response.codigo = 0;
    res.json(response);
  } catch (error) {
    response.mensaje = "Error al listar personas\n" + error.message;
    response.dato = null;
    response.codigo = -1;
    res.status(500).json(response);
  }
});

module.exports = router;
