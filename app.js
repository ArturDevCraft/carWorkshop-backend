import fs from 'node:fs/promises';
const express = require('express');
import bodyParser from 'body-parser';

const authRoutes = require('./routes/auth');

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

app.post();

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
