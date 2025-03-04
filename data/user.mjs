import { hash } from 'bcryptjs';

import db from '../db/conn.mjs';

export async function get(email) {
	const collection = await db.collection('users');
	const query = { email: email };
	const result = await collection.findOne(query);

	if (!result) {
		// res.send('Not found').status(404);
		return false;
	} else {
		// res.send(result).status(200);
		return result;
	}
}

export async function add(data) {
	const collection = await db.collection('users');
	const hashedPass = await hash(data.password, 12);
	const newDocument = { ...data, password: hashedPass };
	const result = await collection.insertOne(newDocument);

	return result;
}
