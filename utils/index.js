const jsonwebtoken = require('jsonwebtoken');

const generateJWTtoken = (user) => {
	const _id = user._id;
	const expiresIn = '1d';
	const payload = {
		sub: _id,
		iat: Date.now(),
	};

	const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
		expiresIn,
	});

	return {
		token: 'Bearer ' + signedToken,
		expires: expiresIn,
	};
};

module.exports.generateJWTtoken = generateJWTtoken;
