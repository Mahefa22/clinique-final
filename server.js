const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const port = 4001;

// Configuration de express-session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Liste des utilisateurs autorisés avec leurs emails et mots de passe
const authorizedUsers = [
    { email: 'Cur@exemple.com', password: bcrypt.hashSync('1234', 10) },
    { email: 'user2@example.com', password: bcrypt.hashSync('456', 10) }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Route pour la page de login
app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

function authenticateUser(req, res, next) {
    const { email, password } = req.body;
    const authorizedUser = authorizedUsers.find(user => user.email === email);

    if (!authorizedUser || !bcrypt.compareSync(password, authorizedUser.password)) {
        return res.redirect('/login.html?error=true');
    }
    // Stocker l'utilisateur dans la session
    req.session.user = authorizedUser;
    next();
}


// Route pour gérer le processus de login
app.post('/login', authenticateUser, (req, res) => {
    console.log(`Logged in as ${req.session.user.email}`);
    res.redirect('/manage.html'); // Rediriger vers la page de gestion après le login
});

// Route pour la déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error');
        }
        res.redirect('/login.html'); // Rediriger vers la page de login après la déconnexion
    });
});

// Charger les patients depuis un fichier JSON
const getPatients = () => {
    try {
        const data = fs.readFileSync('patients.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Sauvegarder les patients dans un fichier JSON
const savePatients = (patients) => {
    fs.writeFileSync('patients.json', JSON.stringify(patients, null, 2), 'utf8');
};

// Route pour obtenir la liste des patients
app.get('/patients', (req, res) => {
    const patients = getPatients();
    res.json(patients);
});

// Route pour ajouter ou mettre à jour les patients
app.post('/patients', (req, res) => {
    const patients = req.body;
    savePatients(patients);
    res.json({ message: 'Patients saved successfully' });
});

// Route pour les autres pages sécurisées
app.get('/secure-page.html', authenticateUser, (req, res) => {
    res.sendFile(__dirname + '/public/secure-page.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
