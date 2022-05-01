import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Comments, RatingProduct } from '@prisma/client';

type Data =
	| { message: string }
	| {
			comment: Comments;
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return addComment(req, res);
		}
		case 'PUT': {
			return updateComment(req, res);
		}
		case 'DELETE': {
			return deleteComment(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const addComment = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const {
		comment = '',
		rating = 0,
		ratingId = 0,
		userCode = 0,
		productId = 0
	} = req.body as {
		comment: string;
		rating: number;
		ratingId: number;
		userCode: number;
		productId: number;
	};
	try {
		if (
			comment !== '' ||
			rating !== 0 ||
			ratingId !== 0 ||
			userCode !== 0 ||
			productId !== 0
		) {
			const oldComment = await prisma.comments.findFirst({
				where: {
					productId,
					userCode
				}
			});
			if (oldComment) {
				res.status(400).json({ message: 'Comment already exists' });
			} else {
				const newComment = await prisma.comments.create({
					data: {
						comment,
						rating,
						ratingId,
						userCode,
						productId
					}
				});
				updateRating(productId);
				res.status(200).json({ comment: newComment });
			}
		} else {
			res.status(400).json({ message: 'Bad Request' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
const updateComment = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		comment = '',
		rating = 0,
		ratingId = 0,
		userCode = 0,
		productId = 0
	} = req.body as {
		comment: string;
		rating: number;
		ratingId: number;
		userCode: number;
		productId: number;
	};
	try {
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};
const deleteComment = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { userCode = 0, productId = 0 } = req.body as {
		userCode: number;
		productId: number;
	};
	try {
		const comment = await prisma.comments.findFirst({
			where: {
				userCode,
				productId
			}
		});
		if (comment) {
			await prisma.comments.delete({
				where: {
					id: comment.id
				}
			});
			updateRating(productId);
			return res.status(200).json({ message: 'Comment deleted' });
		} else {
			return res.status(400).json({ message: 'Comment not found' });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

const updateRating = async (productId: number) => {
	const allRating = await prisma.comments.findMany({
		where: {
			productId
		},
		select: {
			rating: true
		}
	});
	const rating = allRating.reduce((acc, cur) => acc + cur.rating, 0);
	await prisma.ratingProduct.update({
		where: {
			productId
		},
		data: {
			rating: rating / allRating.length
		}
	});
};
