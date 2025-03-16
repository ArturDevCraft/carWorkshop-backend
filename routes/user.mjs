import express from 'express';

import { get } from '../data/user.mjs';
import { checkAuth } from '../util/auth.mjs';

const router = express.Router();

router.use(checkAuth);

router.get('/user', async (req, res, next) => {
	try {
		const data = await get(req.user.userId);
		res
			.status(201)
			.json({
				loggedUserData: { email: data.email, role: data.role, name: data.name },
			});
	} catch (error) {
		next(error);
	}
});

export default router;
