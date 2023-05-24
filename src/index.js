const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const personasRouter = require('./routes/personas'); 
const eventosRouter = require('./routes/controlEventos'); 

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


// Rutas 
app.use('/personas', personasRouter);  
app.use('/controlEvento', eventosRouter);  


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en ejecucion en http://localhost:${port}`);
});
