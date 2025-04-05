import express from 'express';
import {
	isValidEmail,
	isValidText,
	isEqualToOtherValue,
} from '../util/validation.mjs';

import { get, updateUser, userExists } from '../data/user.mjs';
import { checkAuth, isValidPassword } from '../util/auth.mjs';

const router = express.Router();

router.use(checkAuth);

router.get('/user', async (req, res, next) => {
	try {
		const data = await get(req.user.userId);
		res.status(201).json({
			loggedUserData: { email: data.email, role: data.role, name: data.name },
		});
	} catch (error) {
		next(error);
	}
});

router.put('/updateuser', async (req, res, next) => {
	const data = { ...req.body };
	let errors = {};

	let user;
	user = await get(req.user.userId);

	if (!isEqualToOtherValue(data.email, user.email)) {
		(await userExists(data.email))
			? (errors.email = 'This email already exists')
			: '';
	}

	if (!isValidText(data.name, 1)) {
		errors.name = 'Invalid name. Must be at least 1 character long';
	}

	if (!isValidEmail(data.email)) {
		errors.email = 'Invalid email';
	}

	if (
		isValidText(data.newPassword, 1) &&
		!isEqualToOtherValue(data.newPassword, data.confirmPassword)
	) {
		!isValidText(data.oldPassword)
			? (errors.oldPassword = 'You must provide old password')
			: '';

		errors.newPassword = 'Passwords must be the same';
		errors.confirmPassword = 'Passwords must be the same';
	}

	if (isValidText(data.newPassword, 1)) {
		!isValidText(data.newPassword, 6)
			? (errors.newPassword = 'Password must be at least 6 characters long')
			: '';
		const pwIsValid = await isValidPassword(data.oldPassword, user.password);

		if (!pwIsValid) {
			errors.oldPassword = 'Old password incorrect';
		}
	}

	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			message: 'User updating failed due to validation errors.',
			errors,
		});
	} else {
		const updated = await updateUser({
			userId: req.user.userId,
			name: data.name,
			email: data.email,
			password: data.newPassword,
		});
		if (updated) {
			res.status(201).json({ message: 'User updated corectly.', updated });
		} else {
			res.status(422).json({
				message: 'Something went wrong during saving data in database.',
			});
		}
	}
});

export default router;
