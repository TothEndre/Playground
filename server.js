const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();
var underConstruction = false; // set to true if you want to show the maintenance page only

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

if (underConstruction) {
  app.use((req, res, next) => {
    res.render('maintenance.hbs');
  });
}

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to log to server.log');
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Hey there, welcome to our great new website'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects\' page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: "Bad call, oops"
  })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
});