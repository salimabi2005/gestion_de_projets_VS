const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

// Import your models
const User = require('./models/user-model');
const Project = require('./models/projects-model');
const List = require('./models/lists-model');
const Task = require('./models/tasks-model');
const Piece = require('./models/pieces-model');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the frontend's build directory (Vue.js)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.post('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclure le mot de passe
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/projects', async (req, res) => {
    try {
        const Projects = await Project.find();
        res.status(200).json(Projects);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/lists', async (req, res) => {
    try {
        const Lists = await List.find();
        res.status(200).json(Lists);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const Tasks = await Task.find();
        res.status(200).json(Tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/pieces', async (req, res) => {
    try {
        const Pieces = await Piece.find();
        res.status(200).json(Pieces);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour créer un utilisateur
app.post('/users/create', async (req, res) => {
    try {
        const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
        const newUser = new User({
            _id: new Date().getTime(),
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: hashedPassword,
            role: "user",
            statut: "en attente",

        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'Enregistrement validé', user: savedUser });
    } catch (error) {
        res.status(400).json({ message: 'Problème d\'inscription', error });
    }
});
app.post('/users/update', async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        }
        const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).send("User not found");
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/users/delete', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.body._id);
        if (!deletedUser) return res.status(404).send("User not found");
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const user = await User.findOne({ email, password: hashedPassword, statut: "accepter" });

        if (!user) return res.json({
            message:"email ou mot de passe incorrect"
        })
        res.status(200).json({
            user:user
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour créer un projet
app.post('/projects/create', upload.single('image'), async (req, res) => {
    try {
        const newProject = new Project({
            _id: new Date().getTime(),
            name: req.body.name,
            image: req.file.path,
        });

        const savedProject = await newProject.save();
        res.status(201).json({ message: 'Projet créé avec succès', savedProject });
    } catch (error) {
        res.status(400).json({ message: 'Problème lors de la création du projet', error });
    }
});
app.post('/projects/update',  upload.single('image'), async (req, res) => {
    try {
        console.log('1 :', req.file.path);
        console.log('body :', req.body.name);
        console.log('id :', req.body._id);
        
        const updateP = {
            name: req.body.name,
            image: req.file.path,
        }
        const updatedProject = await Project.findByIdAndUpdate(req.body._id, updateP, { new: true, runValidators: true });
        if (!updatedProject) return res.status(404).send("Project not found");
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/projects/getByProjectId', async (req, res) => {
    try {
        const project = await Project.find(req.body)
        res.status(200).json(project);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/projects/delete', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.body._id);
        if (!deletedProject) return res.status(404).send("Project not found");
        res.status(200).json(deletedProject);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour créer une liste
app.post('/lists/create', async (req, res) => {
    try {
        const newList = new List({
            _id: new Date().getTime(),
            name: req.body.name,
            idProject: req.body.idProject,
        });

        const savedList = await newList.save();
        res.status(201).send(savedList);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/lists/update', async (req, res) => {
    try {
        const updatedList = await List.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true });
        if (!updatedList) return res.status(404).send("List not found");
        res.status(200).json(updatedList);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/lists/delete', async (req, res) => {
    try {
        const deletedList = await List.findByIdAndDelete(req.body._id);
        if (!deletedList) return res.status(404).send("List not found");
        res.status(200).json(deletedList);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/lists/getByProject', async (req, res) => {
    try {

        const list = await List.find(req.body)
        res.status(200).json(list);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour créer une tache
app.post('/tasks/create', async (req, res) => {
    try {
        console.log("req :",req);
        const newTask = new Task({
            _id: new Date().getTime(),
            name: req.body.name,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            assignedTo: req.body.assignedTo,
            description: req.body.description,
            idProject: req.body.idProject,
            id_list: req.body.id_list,
        });

        const savedTask = await newTask.save();
        res.status(201).send(savedTask);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/tasks/update', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true });
        if (!updatedTask) return res.status(404).send("Task not found");
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/tasks/delete', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.body._id);
        if (!deletedTask) return res.status(404).send("Task not found");
        res.status(200).json(deletedTask);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/tasks/getone', async (req, res) => {
    try {
        const task = await Task.findOne(req.body)
        res.status(200).json(task);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/tasks/getByList', async (req, res) => {
    try {
        const task = await Task.find(req.body)
        res.status(200).json(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Route pour créer une piece jointe
app.post('/pieces/create', upload.single('image'), async (req, res) => {
    try {
        console.log("req1561 :",req.file);
        const newPiece = new Piece({
            _id: new Date().getTime(),
            name: req.file.filename,
            url: req.file.path,
            date: new Date().toLocaleDateString('en-CA'),
            id_task: req.body.id_task,
        });

        const savedPiece = await newPiece.save();
        res.status(201).send(savedPiece);
    } catch (error) {
        res.status(400).send(error);
    }
});
app.post('/pieces/delete', async (req, res) => {
    try {
        const deletedPiece = await Piece.findByIdAndDelete(req.body._id);
        if (!deletedPiece) return res.status(404).send("Piece not found");
        res.status(200).json(deletedPiece);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/pieces/getByTask', async (req, res) => {
    try {
        const piece = await Piece.find(req.body)
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post('/pieces/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join('uploads', req.file.filename);
        const newPiece = new Piece({
            _id: new Date().getTime(),
            name: req.file.filename,
            url: filePath,
            id_task: req.body.id_task,
        });

        const savedPiece = await newPiece.save();
        res.status(201).send(savedPiece);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Other API routes (same as before)

// Route to serve frontend (Vue.js client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/gestion_de_projets", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('\033[32m', 'Connected to MongoDB', '\033[0m');
    })
    .catch((error) => {
        console.log('\033[31m', 'Error connecting to MongoDB:', error, '\033[0m');
    });

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
