import { FC } from 'react';
import { Comments } from '@prisma/client';
import { CommentItem } from './CommentItem';

interface Props {
	comments: (Comments & {
		user: {
			firstName: string;
			lastName: string;
			userCode: number;
		};
	})[];
}

export const CommentList: FC<Props> = ({ comments }) => {
	return (
		<div className='mt-5'>
			{comments.length > 0 ? (
				<div className='flex flex-col w-full m-auto gap-5'>
					{comments.map((comment) => (
						<CommentItem key={comment.id} comment={comment} />
					))}
				</div>
			) : (
				<h2 className='text-xl text-center'>
					No hay comentarios aun, deja uno!
				</h2>
			)}
		</div>
	);
};
