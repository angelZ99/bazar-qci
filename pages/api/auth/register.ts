import { NextApiRequest, NextApiResponse } from 'next';
import { hashSync } from 'bcryptjs';
import { Users } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { validatePassword, validateEmail } from '../../../lib/helpers';
import { signToken } from '../../../lib/jwt';
import { IUser } from '../../../interfaces';

type Data =
	| { message: string }
	| {
			token: string;
			user: IUser;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return registerUser(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const registerUser = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		firstName = '',
		lastName = '',
		userCode = 0,
		email = '',
		password = ''
	} = req.body as {
		firstName: string;
		lastName: string;
		userCode: number;
		email: string;
		password: string;
	};

	const user: Users | null = await prisma.users.findUnique({
		where: {
			email: email
		}
	});

	if (user) {
		return res.status(406).json({ message: 'Credentials already exist' });
	}
	if (!validatePassword(password)) {
		return res.status(400).json({ message: 'Invalid password' });
	}
	if (!validateEmail(email)) {
		return res.status(400).json({ message: 'Invalid email ***' });
	}

	const token = signToken(userCode, email, 'user');

	await prisma.users
		.create({
			data: {
				firstName: firstName,
				lastName: lastName,
				userCode: userCode,
				email: email.toLocaleLowerCase(),
				password: hashSync(password)
			}
		})
		.then((newUser) => {
			return res.status(200).json({
				token,
				user: {
					firstName: newUser.firstName,
					lastName: newUser.lastName,
					email: newUser.email,
					userCode: newUser.userCode,
					verified: newUser.verified,
					role: newUser.role,
					favorites: [],
					comments: []
				}
			});
		})
		.catch((error) => {
			return res.status(500).json({ message: 'Internal Server Error' });
		});
};
