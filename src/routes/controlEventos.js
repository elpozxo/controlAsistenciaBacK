const express = require("express");
const router = express.Router();
const ControlAsistencia = require("../models/controlAsistencia");
const Persona = require("../models/persona");
const { Op } = require("sequelize");
const response = {
  codigo: 0, // -1 mal; 0 ok; 1 Warni
  mensaje: "",
  dato: null,
};

// Ruta para registrar un evento de control de asistencia
router.post("/", async (req, res) => {
  // Validar si el documento es un número
  if (isNaN(req.body.documento)) {
    response.mensaje = "Documento debe ser numero";
    response.codigo = 1;
    res.status(400).json(response);
    return;
  }
  try {
    // Verificar si el documento existe en la tabla de personas
    const persona = await Persona.findOne({
      where: { documento: req.body.documento },
    });
    if (!persona) {
      response.mensaje = "Documento no encontrado";
      response.codigo = 1;
      res.status(404).json(response);
      return;
    }
    // Verificar si ya existe un evento del mismo tipo en el mismo día
    const fechaEvento = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const inicioDiaEvento = new Date(fechaEvento);
    const finDiaEvento = new Date(fechaEvento);
    finDiaEvento.setDate(finDiaEvento.getDate() + 1);
    const eventoExistente = await ControlAsistencia.findOne({
      where: {
        documento: req.body.documento,
        tipoEvento: req.body.tipoEvento,
        fechaEvento: {
          [Op.between]: [inicioDiaEvento, finDiaEvento],
        },
      },
    });
    if (eventoExistente) {
      response.mensaje = "Ya existe un evento del mismo tipo en este día";
      response.dato = eventoExistente;
      response.codigo = 1;
      res.status(400).json(response);
      return;
    }
    // Crear el evento de control de asistencia
    const controlAsistencia = await ControlAsistencia.create({
      documento: req.body.documento,
      tipoEvento: req.body.tipoEvento,
    });
    response.mensaje = "Evento de control de asistencia registrado";
    response.codigo = 0;
    response.dato = controlAsistencia;
    res.status(201).json(response);
  } catch (error) {
    response.mensaje = error.message;
    response.codigo = -1;
    res.status(400).json(response);
  }
});
router.get("/:cedula", async (req, res) => {
  // Validar si el documento es un número
  if (isNaN(req.params.cedula)) {
    response.mensaje = "Documento debe ser numero";
    response.codigo = 1;
    res.status(400).json(response);
    return;
  }
  const cedula = req.params.cedula;
  try {
    // Buscar la persona por cédula
    const persona = await Persona.findOne({
      where: { documento: cedula },
    });
    if (!persona) {
      response.mensaje = "Persona no existe";
      response.codigo = 1;
      res.status(404).json(response);
    }
    // Buscar los eventos de control de asistencia de la persona por cédula
    const eventos = await ControlAsistencia.findAll({
      where: { documento: cedula },
    });
    response.mensaje = "Eventos";
    response.codigo = 0;
    response.dato = eventos;
    return res.json(response);
  } catch (error) {
    response.mensaje = "Error al consultar la Base Datos";
    response.codigo = -1;
    return res.status(500).json(response);
  }
});
router.get("/", async (req, res) => {
  try {
    // Buscar los eventos de control de asistencia de la persona por cédula
    const eventos = await ControlAsistencia.findAll();
    response.mensaje = "Eventos";
    response.codigo = 0;
    response.dato = eventos;
    return res.json(response);
  } catch (error) {
    response.mensaje = "Error al consultar la Base Datos";
    response.codigo = -1;
    return res.status(500).json(response);
  }
});
module.exports = router;
