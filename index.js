const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 8000;

const routesHandler = require('./routes/index');

// Middlewares
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

app.use(routesHandler);

app.get('*', (req, res) => {
  res.send('Page not found');
});

app.listen(port, console.log(`Server started at port ${port}`));
