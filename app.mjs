import fs from 'node:fs/promises';
import express from 'express';
import bodyParser from 'body-parser';

// Load environment variables
import './loadEnvironment.mjs';

import authRoutes from './routes/auth.mjs';

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(authRoutes);

// app.get('/login', (req, res) => {});

// app.post();

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
