import dotenv from 'dotenv';
import authenticate from './authenticate/index.js';
dotenv.config();

import moviesRouter from './api/movies/index.js';
import express from 'express';
import cors from 'cors';

import { connectDB } from './db/index.js';
import usersRouter from './api/users/index.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Tasky API is running');
});


app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);

app.use((req, res) => {
  res.status(404).json({
    code: 404,
    msg: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    code: 500,
    msg: 'Something went wrong',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

connectDB();

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}`);
});