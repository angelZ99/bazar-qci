import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@prisma/client';
import { CategoryItem } from './CategoryItem';

interface Props {
	categories: Category[];
	currentCategory?: string;
}

export const CategoryList: FC<Props> = ({ categories, currentCategory }) => {
	return (
		<div>
			<h2 className='text-2xl font-semibold mb-3 md:text-center'>
				Categorias:
			</h2>
			<div className='flex overflow-x-auto gap-1 md:justify-center'>
				<Link href={'/products/'} passHref>
					<a
						className={`text-center min-w-[85px] ${
							!currentCategory && 'border-b-2 border-black'
						}`}
					>
						<Image
							src='/img/allProducts.png'
							alt='icon-allProducts'
							width={64}
							height={64}
						/>
						<h3 className='font-bold text-ellipsis whitespace-nowrap overflow-hidden'>
							Todos los productos
						</h3>
					</a>
				</Link>
				{categories.map((category) => (
					<CategoryItem
						key={category.id}
						category={category}
						currentCategory={currentCategory}
					/>
				))}
			</div>
		</div>
	);
};
