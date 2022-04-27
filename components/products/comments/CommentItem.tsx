import React, { FC } from 'react';
import { Comments } from '@prisma/client';

interface Props {
	comment: Comments & {
		user: {
			firstName: string;
			lastName: string;
			userCode: number;
		};
	};
}

export const CommentItem: FC<Props> = ({ comment }) => {
	const { firstName, lastName, userCode } = comment.user;
	return (
		<div className='border border-gray-300 p-5 flex flex-col w-full rounded-sm'>
			<div className='flex w-full justify-between font-semibold mb-2'>
				<p>{firstName + ' ' + lastName}</p>
				<p> {userCode} </p>
			</div>
			<div>{comment.comment}</div>
			<div className='flex flex-row-reverse text-sm'>
				Calificacion: {comment.rating}
			</div>
		</div>
	);
};
