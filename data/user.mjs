import { hash } from 'bcryptjs';
import { v4 as generateId } from 'uuid';

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
	const newDocument = data;
	const result = await collection.insertOne(newDocument);

	return result;
}
