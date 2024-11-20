import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
const app = express();


app.use(bodyParser.json());
app.use(cors())

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Firebase Integration Working!');
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

export default app;
