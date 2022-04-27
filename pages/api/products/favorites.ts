import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Favorites } from '@prisma/client';

type Data =
	| { message: string }
	| {
			favorite: Favorites;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return addFavorite(req, res);
		}
		case 'DELETE': {
			return deleteFavorite(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const addFavorite = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { userCode, productId } = req.body as {
		userCode: number;
		productId: number;
	};
	try {
		if (userCode && productId) {
			const favorite = await prisma.favorites.findFirst({
				where: {
					userCode,
					productId
				}
			});
			if (favorite) {
				return res.status(400).json({ message: 'Already favorite' });
			} else {
				const data = await prisma.favorites.create({
					data: {
						userCode,
						productId
					}
				});
				return res.status(200).json({ favorite: data });
			}
		} else {
			return res.status(400).json({ message: 'Invalid userCode or productId' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
const deleteFavorite = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { userCode, productId } = req.body as {
		userCode: number;
		productId: number;
	};
	try {
		if (userCode && productId) {
			const favorite = await prisma.favorites.findFirst({
				where: {
					userCode,
					productId
				}
			});
			if (favorite) {
				const data = await prisma.favorites.delete({
					where: {
						id: favorite.id
					}
				});
				return res.status(200).json({ favorite: data });
			} else {
				return res.status(400).json({ message: 'Not favorite product' });
			}
		} else {
			return res.status(400).json({ message: 'Invalid userCode or productId' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
