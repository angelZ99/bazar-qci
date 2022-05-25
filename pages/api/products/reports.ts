import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Reports } from '@prisma/client';

type Data =
	| { message: string }
	| {
			report: Reports | null;
	  }
	| {
			reports: Reports[];
	  };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST': {
			return createReport(req, res);
		}
		case 'DELETE': {
			return deleteReport(req, res);
		}
		default: {
			res.status(405).json({ message: 'Method Not Allowed' });
		}
	}
}

const createReport = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		title,
		description = '',
		productId,
		userCode = 0
	} = req.body as {
		title: string;
		description?: string;
		productId: number;
		userCode?: number;
	};

	try {
		const report = await prisma.reports.create({
			data: {
				title,
				description,
				productId,
				userCode
			}
		});
		return res.status(201).json({ report });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

const deleteReport = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { productId } = req.body as { productId: string };

	try {
		await prisma.reports.deleteMany({
			where: { productId: Number(productId) }
		});
		return res.status(200).json({ message: 'Report deleted' });
	} catch (error) {
		res.status(500).json({ message: 'Internal Server Error' });
	}
};
