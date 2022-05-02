import { NextApiRequest, NextApiResponse } from 'next';
import { compareSync } from 'bcryptjs';
import prisma from '../../../lib/prisma';
import { IAdmin } from '../../../interfaces';

type Data =
	| {
			isValidLogin: boolean;
			message: string;
	  }
	| {
			isValidLogin: boolean;
			admin: IAdmin;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return loginAdmin(req, res);
		}
		default: {
			res
				.status(405)
				.json({ isValidLogin: false, message: 'Method Not Allowed' });
		}
	}
}

const loginAdmin = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = '', password = '', role = '' } = req.body;

	if (email === '' || password === '' || role === '') {
		return res
			.status(400)
			.json({ isValidLogin: false, message: 'Please enter all fields' });
	}
	try {
		if (role === 'admin') {
			const admin = await prisma.admin.findUnique({
				where: {
					email
				}
			});
			if (!admin) {
				return res
					.status(400)
					.json({ isValidLogin: false, message: 'Admin not found' });
			}
			if (compareSync(password, admin.password)) {
				return res.status(200).json({
					isValidLogin: true,
					admin: {
						firstName: admin.firstName,
						lastName: admin.lastName,
						email: admin.email,
						role: admin.role
					}
				});
			}
			return res
				.status(400)
				.json({ isValidLogin: false, message: 'Incorrect password' });
		}
		if (role === 'vendor') {
			const vendor = await prisma.vendors.findUnique({
				where: {
					email
				}
			});
			if (!vendor) {
				return res.status(400).json({
					isValidLogin: false,
					message: 'Vendor not found'
				});
			}
			if (compareSync(password, vendor.password)) {
				return res.status(200).json({
					isValidLogin: true,
					admin: {
						firstName: vendor.firstName,
						lastName: vendor.lastName,
						email: vendor.email,
						role: vendor.role,
						vendorCode: vendor.vendorCode,
						phoneNumber: vendor.phoneNumber,
						rating: vendor.rating
					}
				});
			}
			return res.status(400).json({
				isValidLogin: false,
				message: 'Incorrect password'
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			isValidLogin: false,
			message: 'Server Error'
		});
	}
};
