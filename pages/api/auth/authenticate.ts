import { Users } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../../../interfaces';
import { isValidToken } from '../../../lib/jwt';
import prisma from '../../../lib/prisma';

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
		case 'GET': {
			return authenticate(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const authenticate = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { token = '' } = req.cookies;

	try {
		const { email } = await isValidToken(token);

		const user: Users | null = await prisma.users.findFirst({
			where: {
				email: email
			}
		});

		if (!user) {
			return res.status(401).json({ message: "The user doesn't exist" });
		}

		const { firstName, lastName, verified, userCode, role } = user;

		return res.status(200).json({
			token,
			user: {
				firstName,
				lastName,
				email,
				userCode,
				verified,
				role
			}
		});
	} catch (error) {
		res.status(401).json({ message: 'Invalid token' });
	}
};
