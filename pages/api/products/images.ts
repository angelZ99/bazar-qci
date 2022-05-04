import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Images } from '@prisma/client';
import { products } from '../../../data/products';
import { url } from 'inspector';

type Data =
	| { message: string }
	| {
			images: Images[];
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return addImage(req, res);
		}
		case 'DELETE': {
			return deleteImage(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const addImage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { urls, productId } = req.body as {
		urls: string[];
		productId: number;
	};
	try {
		if (urls?.length && productId) {
			const images = await Promise.all(
				urls.map(async (url) => {
					return await prisma.images.create({
						data: {
							url,
							productId
						}
					});
				})
			);
			return res.status(200).json({ images });
		} else {
			return res.status(400).json({ message: 'Invalid request' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const deleteImage = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { imageId = 0 } = req.body as {
		imageId: number;
	};

	try {
		if (imageId) {
			const image = await prisma.images.delete({
				where: {
					id: imageId
				}
			});
			return res.status(200).json({ images: [image] });
		} else {
			return res.status(400).json({ message: 'Invalid imageId' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
