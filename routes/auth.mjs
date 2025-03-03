import express from 'express';
import db from '../db/conn.mjs';

import { isValidEmail, isValidText } from '../util/validation.mjs';
import { get, add } from '../data/user.mjs';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
	const data = { role: 'customer', ...req.body };
	let errors = {};

	if (!isValidEmail(data.email)) {
		errors.email = 'Invalid email.';
	} else {
		const existingUser = await get(data.email);
		if (existingUser) {
			errors.email = 'Email alredy exists.';
		}
	}

	if (!isValidText(data.password, 6)) {
		errors.password = 'Invalid password. Must be at least 6 characters long.';
	}

	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			message: 'User signup failed due to validation errors.',
			errors,
		});
	} else {
		const added = await add(data);
		if (added) {
			res.status(201).json({ message: 'User created.', added });
		} else {
			res.status(422).json({
				message: 'Something went wrong during saving data in database.',
			});
		}
	}
});

router.post('/login', async (req, res, next) => {
	const data = req.body;
	let errors = {};
});

router.get('/users', async (req, res) => {
	const collection = db.collection('users');
	const results = await collection.find({}).toArray();
	res.send(results).status(200);
});

export default router;
