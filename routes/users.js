const mongoose = require('mongoose');
const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const utils = require('../utils');

const authorized = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, async (err, token) => {
		if (err || !token) {
			res.status(401).json({ message: 'Unauthorized Message' });
		}

		try {
			const user = await User.findOne({ _id: token.sub });
			req.user = user;
		} catch (error) {
			res.status(401).json({ message: 'Unauthorized Message' });
		}

		next();
	})(req, res, next);
};

router.get('/dashboard', authorized, (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: 'You are successfully authenticated to dashboard route',
	});
});

router.post('/login', async function (req, res, next) {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: utils.generateJWTtoken(user),
		});
	} else {
		res.status(400).json({ msg: 'Invalid email or password' });
	}
});

router.post('/register', async function (req, res, next) {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400).json({ msg: 'Error' });
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: utils.generateJWTtoken(user),
		});
	} else {
		res.status(400).json({ msg: 'Error' });
	}
});

module.exports = router;
