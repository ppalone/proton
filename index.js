const express = require('express');

const app = express();

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Server up and running ⚡')
});

app.get('*', (req, res) => {
  res.send('Page not found');
})

app.listen(port, console.log(`Server started at port ${port}`));
