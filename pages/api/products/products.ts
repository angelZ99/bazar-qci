import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Products } from '@prisma/client';

type Data =
	| { message: string }
	| {
			products: Products[] | null;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return getProducts(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { categoryId = 0, vendorCode = 0 } = req.body as {
		categoryId?: number;
		vendorCode?: number;
	};
	try {
		if (categoryId === 0 && vendorCode === 0) {
			const products = await prisma.products.findMany({
				orderBy: {
					published: 'desc'
				}
			});
			return res.status(200).json({ products });
		} else if (categoryId > 0) {
			const products = await prisma.products.findMany({
				where: {
					categoryId,
					published: true
				}
			});
			return res.status(200).json({ products });
		} else if (vendorCode > 0) {
			const products = await prisma.products.findMany({
				where: {
					vendorCode
				}
			});
			return res.status(200).json({ products });
		} else {
			return res
				.status(400)
				.json({ message: 'Invalid categoryId or vendorCode' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
