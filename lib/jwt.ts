import jwt from 'jsonwebtoken';

export const signToken = (userCode: number, email: string) => {
	if (!process.env.JWT_SECRET_KEY) {
		throw new Error(
			'JWT_SECRET is not defined - define the environment variable for the jwt'
		);
	}

	return jwt.sign(
		//payload
		{ userCode, email },
		//Private key
		process.env.JWT_SECRET_KEY,
		//options
		{ expiresIn: '7d' }
	);
};

interface dataToken {
	userCode: number;
	email: string;
}

export const isValidToken = (token: string): Promise<dataToken> => {
	if (!process.env.JWT_SECRET_KEY) {
		throw new Error(
			'JWT_SECRET is not defined - define the environment variable for the jwt'
		);
	}

	return new Promise((resolve, reject) => {
		try {
			jwt.verify(token, process.env.JWT_SECRET_KEY || '', (err, payload) => {
				if (err) return reject('Invalid token');

				const { userCode, email } = payload as {
					userCode: number;
					email: string;
				};

				resolve({ userCode, email });
			});
		} catch (error) {
			return reject('Invalid token');
		}
	});
};
