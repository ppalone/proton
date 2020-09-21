const express = require('express');

const app = express();

const port = process.env.PORT || 8000;

const routesHandler = require('./routes/index');

app.use(routesHandler);

app.get('*', (req, res) => {
  res.send('Page not found');
});

app.listen(port, console.log(`Server started at port ${port}`));
