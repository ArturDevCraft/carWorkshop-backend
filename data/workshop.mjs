import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

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

export async function updateCar(data) {
	const collection = await db.collection('cars');

	const query = { _id: new ObjectId(data.carId), userId: data.userId };
	const updates = { make: data.make, model: data.model, vin: data.vin };
	const result = await collection.updateOne(query, updates);

	return result;
}

export async function deleteCar(userId, carId) {
	const collection = await db.collection('cars');
	const query = { _id: new ObjectId(carId), userId: userId };
	const result = await collection.deleteOne(query);

	return result;
}
