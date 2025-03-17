import fs from 'node:fs/promises';
import express from 'express';
import bodyParser from 'body-parser';

import './loadEnvironment.mjs';

import authRoutes from './routes/auth.mjs';
import workshopRoutes from './routes/workshop.mjs';
import userRoutes from './routes/user.mjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	next();
});

app.get('/', function (req, res) {
	res.status(201).json({ message: 'OK' });
});
app.use(authRoutes);
app.use(workshopRoutes);
app.use(userRoutes);

// app.post();

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

export default app;
