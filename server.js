// Import Express and routes
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors())
// Use the authentication routes
app.use('/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
    res.status(200).send('Firebase Integration Working!');
});

// Start the server and listen for incoming requests
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export default app;
