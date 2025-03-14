import express from 'express';

import { isValidText, isEqualToOtherValue } from '../util/validation.mjs';
import { getCars, addCar } from '../data/workshop.mjs';
import { checkAuth } from '../util/auth.mjs';

const router = express.Router();
router.use(checkAuth);

router.post('/addcar', async (req, res, next) => {
	const data = { ...req.body };
	let errors = {};

	if (!isValidText(data.make, 1)) {
		errors.make = 'Invalid make. Must be at least 1 character long';
	}
	if (!isValidText(data.model, 1)) {
		errors.model = 'Invalid model. Must be at least 1 character long';
	}
	if (!isValidText(data.vin, 17)) {
		errors.model = 'Invalid VIN. Must be 17 characters long';
	}

	if (req.user.role !== 'customer') {
		errors.role = 'Invalid role. You can not do this operation';
	}

	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			message: 'Car adding failed due to validation errors.',
			errors,
		});
	} else {
		const added = await addCar({
			userId: req.user.userId,
			make: data.make,
			model: data.model,
			vin: data.vin,
		});
		if (added) {
			res.status(201).json({ message: 'Car added.', added });
		} else {
			res.status(422).json({
				message: 'Something went wrong during saving data in database.',
			});
		}
	}
});

export default router;
