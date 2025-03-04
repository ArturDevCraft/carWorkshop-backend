import express from 'express';
import db from '../db/conn.mjs';

import { isValidEmail, isValidText } from '../util/validation.mjs';
import { get, add } from '../data/user.mjs';
import { createJSONToken, isValidPassword } from '../util/auth.mjs';

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

	if (!isValidText(data.name, 2)) {
		errors.name = 'Invalid name. Must be at least 2 characters long.';
	}

	if (!isValidText(data.surname, 2)) {
		errors.surname = 'Invalid surnaem. Must be at least 2 characters long.';
	}

	if (!isValidText(data.phone, 9)) {
		errors.phone = 'Invalid phone number. Must be at least 9 numbers long.';
	}

	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			message: 'User signup failed due to validation errors.',
			errors,
		});
	} else {
		const added = await add({
			email: data.email,
			password: data.password,
			name: data.name,
			surname: data.surname,
			phone: data.phone,
			role: data.role,
		});
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
	const email = req.body.email;
	const password = req.body.password;

	let user;
	user = await get(email);

	if (user) {
		const pwIsValid = await isValidPassword(password, user.password);
		if (!pwIsValid) {
			return res.status(422).json({
				message: 'Invalid credentials.',
				errors: { credentials: 'Invalid email or password entered.' },
			});
		}
		const token = createJSONToken(email);
		res.json({ token });
	} else {
		return res.status(401).json({ message: 'Authentication failed.' });
	}
});

export default router;
