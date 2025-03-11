import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

import { compare } from 'bcryptjs';

const KEY = process.env.SECRET_KEY || '';

export function createJSONToken(email, role) {
	return sign({ email, role }, KEY, { expiresIn: '1h' });
}

export function validateJSONToken(token) {
	return verify(token, KEY);
}

export function isValidPassword(password, storedPassword) {
	return compare(password, storedPassword);
}

export function checkAuth(req, res, next) {
	if (req.method === 'OPTIONS') {
		return next();
	}
	if (!req.headers.authorization) {
		console.log('NOT AUTH. AUTH HEADER MISSING.');
		return res.status(401).json({ message: 'NOT AUTH. AUTH HEADER MISSING.' });
	}
	const authFragments = req.headers.authorization.split(' ');

	if (authFragments.length !== 2) {
		console.log('NOT AUTH. AUTH HEADER INVALID.');

		return res.status(401).json({ message: 'NOT AUTH. AUTH HEADER INVALID' });
	}
	const authToken = authFragments[1];
	try {
		const validatedToken = validateJSONToken(authToken);
		req.token = validatedToken;
	} catch (error) {
		console.log('NOT AUTH. TOKEN INVALID.');
		return res.status(401).json({ message: 'NOT AUTH. TOKEN INVALID.' });
	}
	next();
}
