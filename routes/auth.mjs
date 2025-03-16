import express from 'express';

import {
	isValidEmail,
	isValidText,
	isEqualToOtherValue,
} from '../util/validation.mjs';
import { userExists, add, workshopUserExists } from '../data/user.mjs';
import { createJSONToken, isValidPassword } from '../util/auth.mjs';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
	const data = { ...req.body };
	let errors = {};

	if (!isValidEmail(data.email)) {
		errors.email = 'Invalid email.';
	} else {
		const existingUser = await userExists(data.email);
		if (existingUser) {
			errors.email = 'Email alredy exists.';
		}
	}

	if (!isValidText(data.password, 6)) {
		errors.password = 'Invalid password. Must be at least 6 characters long.';
	}

	if (!isEqualToOtherValue(data.password, data.passwordConfirm)) {
		errors.passwordConfirm =
			'Invalid password confirmation. Passwords must be the same.';
	}

	if (!isValidText(data.name, 2)) {
		errors.name = 'Invalid name. Must be at least 2 characters long.';
	}

	if (data.role === 'customer') {
	} else if (data.role === 'workshop') {
		(await workshopUserExists())
			? (errors.role =
					'Workshop administrator is registered you could not register this role.')
			: '';
	} else {
		errors.role = 'Invalid role.';
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
	user = await userExists(email);

	if (user) {
		const pwIsValid = await isValidPassword(password, user.password);
		if (!pwIsValid) {
			return res.status(422).json({
				message: 'Invalid credentials.',
				errors: { credentials: 'Invalid email or password entered.' },
			});
		}
		const token = createJSONToken(email, user.role, user._id);
		res.status(201).json({ token });
	} else {
		return res.status(401).json({ message: 'Authentication failed.' });
	}
});

export default router;
