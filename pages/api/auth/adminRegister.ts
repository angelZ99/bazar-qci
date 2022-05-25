import { NextApiRequest, NextApiResponse } from 'next';
import { hashSync } from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { validatePassword, validateEmail } from '../../../lib/helpers';
import { IAdmin } from '../../../interfaces';

type Data =
	| { message: string }
	| {
			admin: IAdmin;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return registerAdmin(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const registerAdmin = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		vendorCode = 0,
		firstName = '',
		lastName = '',
		email = '',
		password = '',
		phoneNumber = '',
		role = ''
	} = req.body as {
		vendorCode: number;
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		phoneNumber: string;
		role: string;
	};


	const vendor = await prisma.vendors.findUnique({
		where: {
			vendorCode
		}
	});

	if (vendor) {
		return res.status(406).json({ message: 'Credentials already exist' });
	}
	if (!validatePassword(password)) {
		return res.status(400).json({ message: 'Invalid password' });
	}
	if (!validateEmail(email)) {
		return res.status(400).json({ message: 'Invalid email ***' });
	}

	if (role === 'vendor') {
		await prisma.vendors
			.create({
				data: {
					vendorCode,
					firstName,
					lastName,
					email,
					password: hashSync(password, 10),
					phoneNumber,
					role
				}
			})
			.then((newVendor) => {
				return res.status(200).json({
					admin: {
						vendorCode: newVendor.vendorCode,
						firstName: newVendor.firstName,
						lastName: newVendor.lastName,
						email: newVendor.email,
						phoneNumber: newVendor.phoneNumber,
						role: newVendor.role
					}
				});
			})
			.catch((err) => {
				return res.status(500).json({ message: 'Internal Server Error' });
			});
	}
};
