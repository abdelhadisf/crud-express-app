const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://ad:1234@cluster0.4ppooxl.mongodb.net/TP-Web', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Définition du schéma Mongoose pour les étudiants
const studentSchema = new mongoose.Schema({
  nomComplet: String,
  image: String,
  description: String
});

// Création du modèle Mongoose basé sur le schéma
const Student = mongoose.model('Student', studentSchema);

// RESTful Routes

// INDEX ROUTES
app.get('/students', (req, res) => {
  // Récupérer tous les étudiants depuis la base de données
  Student.find({}, (err, students) => {
    if (err) {
      console.error('Error fetching students:', err);
      res.redirect('/');
    } else {
      res.render('index', { students: students });
    }
  });
});

// NEW ROUTE
app.get('/students/new', (req, res) => {
  res.render('new');
});

// CREATE
app.post('/students', (req, res) => {
  // Créer un nouvel étudiant avec les données reçues du formulaire
  const newStudent = new Student({
    nomComplet: req.body.student.nomComplet,
    image: req.body.student.image,
    description: req.body.student.description
  });
  
  // Sauvegarder le nouvel étudiant dans la base de données
  newStudent.save((err) => {
    if (err) {
      console.error('Error saving student:', err);
    }
    res.redirect('/students');
  });
});

// SHOW ROUTE
app.get('/students/:id', (req, res) => {
  // Trouver l'étudiant par son ID dans la base de données
  Student.findById(req.params.id, (err, student) => {
    if (err || !student) {
      console.error('Error fetching student or student not found');
      res.redirect('/students');
    } else {
      res.render('show', { student: student });
    }
  });
});

// EDIT ROUTE
app.get('/students/:id/edit', (req, res) => {
  // Trouver l'étudiant par son ID dans la base de données
  Student.findById(req.params.id, (err, student) => {
    if (err || !student) {
      console.error('Error fetching student or student not found');
      res.redirect('/students');
    } else {
      res.render('edit', { student: student });
    }
  });
});

// UPDATE ROUTE
app.put('/students/:id', (req, res) => {
  // Trouver l'étudiant par son ID dans la base de données et mettre à jour ses données
  Student.findByIdAndUpdate(req.params.id, req.body.student, (err, updatedStudent) => {
    if (err || !updatedStudent) {
      console.error('Error updating student or student not found');
    }
    res.redirect('/students/' + req.params.id);
  });
});

// DELETE ROUTE
app.delete('/students/:id', (req, res) => {
  // Supprimer l'étudiant par son ID de la base de données
  Student.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.error('Error deleting student:', err);
    }
    res.redirect('/students');
  });
});

app.listen(3000, () => {
  console.log('The server is up and running on port 3000');
});
