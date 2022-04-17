import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@prisma/client';

interface Props {
	category: Category;
	currentCategory?: string;
}

export const CategoryItem: FC<Props> = ({ category, currentCategory }) => {
	const { name, icon, id } = category;

	return (
		<Link
			href={{
				pathname: '/products/[category]',
				query: { category: name, id: id }
			}}
			passHref
		>
			<a
				className={`text-center min-w-[85px] ${
					currentCategory === name && 'border-b-2 border-black'
				}`}
			>
				<Image
					src={`/img/${icon}.png`}
					alt={`icon-${name}`}
					width={64}
					height={64}
				/>
				<h3 className='font-bold text-ellipsis whitespace-nowrap overflow-hidden'>
					{name}
				</h3>
			</a>
		</Link>
	);
};
