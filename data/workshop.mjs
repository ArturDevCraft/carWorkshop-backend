import db from '../db/conn.mjs';

export async function getCars(userId) {
	const collection = await db.collection('cars');
	const query = { userId: userId };
	const result = await collection.find(query).toArray();

	if (!result) {
		// res.send('Not found').status(404);
		return false;
	} else {
		// res.send(result).status(200);
		return result;
	}
}

export async function addCar(data) {
	const collection = await db.collection('cars');

	const newDocument = { ...data };
	const result = await collection.insertOne(newDocument);

	return result;
}
