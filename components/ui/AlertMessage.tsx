import React, { FC } from 'react';

interface Props {
	type: string;
	message: string | undefined;
}

export const AlertMessage: FC<Props> = ({ type, message }) => {
	const error = 'border-red-600 bg-red-100';
	const success = 'border-green-600 bg-green-100';
	const warging = 'border-Yellow-600 bg-yellow-100';

	return (
		<div
			className={`${
				type === 'error' ? error : type === 'success' ? success : warging
			} text-center text-xl font-semibold border mt-5 rounded p-2 mb-5 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full md:w-2/3 lg:w-1/2 2xl:w-1/3`}
		>
			<p className='text-lg'> {message} </p>
		</div>
	);
};
