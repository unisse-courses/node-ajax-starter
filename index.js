// All imports needed here
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');

// Creates the express application
const app = express();
const port = 9090;

var students = [
  {
    name: 'Juan Dela Cruz',
    id: '11812345',
    img: 'img/boy.png',
  },
  {
    name: 'Jane Mendoza',
    id: '11867890',
    img: 'img/girl.png',
  },
  {
    name: 'Bobby Sta. Maria',
    id: '11912345',
    img: 'img/boy.png',
  },
  {
    name: 'Carmen Dela Fuentes',
    id: '11712345',
    img: 'img/girl.png',
  }
];

/**
  Creates an engine called "hbs" using the express-handlebars package.
**/
app.engine( 'hbs', exphbs({
  extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
  defaultView: 'main', // this is the default value but you may change it to whatever you'd like
  layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
  partialsDir: path.join(__dirname, '/views/partials'), // Partials folder
}));

// Setting the view engine to the express-handlebars engine we created
app.set('view engine', 'hbs');

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Home route
app.get('/', function(req, res) {
    // The render function takes the template filename (no extension - that's what the config is for!)
    // and an object for what's needed in that template
    res.render('students', {
      title: 'Students List',
    })
});

app.get('/getStudents', function(req, res) {
  // TODO
});

app.post('/addStudent', function(req, res) {
  // TODO
})

/**
  To be able to render images, css and JavaScript files, it's best to host the static files
  and use the expected path in the data and the imports.

  This takes the contents of the public folder and makes it accessible through the URL.
  i.e. public/css/styles.css (in project) will be accessible through http://localhost:9090/css/styles.css
**/
app.use(express.static('public'));

// Listening to the port provided
app.listen(port, function() {
  console.log('App listening at port '  + port)
});
