import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Products } from '@prisma/client';

type Data =
	| { message: string }
	| {
			product: Products | null;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET': {
			return getProduct(req, res);
		}
		case 'POST': {
			return createProduct(req, res);
		}
		case 'PUT': {
			return updateProduct(req, res);
		}
		case 'DELETE': {
			return deleteProduct(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { id = 0 } = req.query;

	try {
		if (id === 0) {
			return res.status(400).json({ message: 'Invalid id' });
		} else {
			const product = await prisma.products.findUnique({
				where: {
					id: Number(id)
				}
			});
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			} else {
				return res.status(200).json({ product });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const createProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		name = '',
		description = '',
		price = 0,
		categoryId = 0,
		vendorCode = 0
	} = req.body as {
		name: string;
		description: string;
		price: number;
		categoryId: number;
		vendorCode: number;
	};
	try {
		if (
			name === '' ||
			description === '' ||
			price === 0 ||
			categoryId === 0 ||
			vendorCode === 0
		) {
			return res.status(400).json({ message: 'Invalid data' });
		} else {
			const product = await prisma.products.create({
				data: {
					name,
					description,
					price,
					categoryId,
					vendorCode
				}
			});

			return res.status(200).json({ product });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const updateProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		id = 0,
		name = '',
		description = '',
		price = 0,
		categoryId = 0,
		vendorCode = 0,
		published
	} = req.body as {
		id: number;
		name: string;
		description: string;
		price: number;
		categoryId: number;
		vendorCode: number;
		published: boolean;
	};
	try {
		if (
			id === 0 ||
			name === '' ||
			description === '' ||
			price === 0 ||
			categoryId === 0 ||
			vendorCode === 0 ||
			published === undefined
		) {
			return res.status(400).json({ message: 'Invalid data' });
		} else {
			const product = await prisma.products.update({
				where: {
					id: id
				},
				data: {
					name,
					description,
					price,
					categoryId,
					vendorCode,
					published
				}
			});
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			} else {
				return res.status(200).json({ product });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const deleteProduct = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { id = 0 } = req.body;
	try {
		if (id === 0) {
			return res.status(400).json({ message: 'Invalid id' });
		} else {
			const product = await prisma.products.delete({
				where: {
					id: id
				}
			});
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			} else {
				return res.status(200).json({ message: 'Product deleted' });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
