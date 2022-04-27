import { NextApiRequest, NextApiResponse } from 'next';
import { compareSync } from 'bcryptjs';
import { Users, Favorites } from '@prisma/client';
import prisma from '../../../lib/prisma';
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
			return loginUser(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = '', password = '' } = JSON.parse(req.body) as {
		email: string;
		password: string;
	};

	const user: Users | null = await prisma.users.findUnique({
		where: {
			email
		},
		include: {
			favorites: true,
			comments: true
		}
	});

	if (!user) {
		return res.status(401).json({ message: 'Invalid Credentials - email' });
	}

	if (!compareSync(password, user.password)) {
		return res.status(401).json({ message: 'Invalid Credentials - pass' });
	}

	const { firstName, lastName, userCode, verified, role } = user;
	const token = signToken(userCode, email, role);

	return res.status(200).json({
		token,
		user: {
			firstName,
			lastName,
			email,
			userCode,
			verified,
			role,
			/*@ts-ignore*/
			favorites: user.favorites,
			/*@ts-ignore*/
			comments: user.comments
		}
	});
};
