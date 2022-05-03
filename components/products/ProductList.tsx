import { Category, Products } from '@prisma/client';
import { FC } from 'react';
import { ProductItem } from './';

interface Props {
	products: Products[];
	categories: Category[];
	currentCategory: string;
	editMode?: boolean;
}

export const ProductList: FC<Props> = ({
	products,
	categories,
	currentCategory,
	editMode = false
}) => {
	return (
		<div className='mt-5'>
			{currentCategory && (
				<h3 className='text-2xl mb-3'>
					Productos de: <span className='font-bold'> {currentCategory} </span>
				</h3>
			)}
			<div className='flex flex-wrap gap-3'>
				{products.map((product) => {
					const category = categories.find(
						(category) => category.id === product.categoryId
					);
					return (
						<ProductItem
							key={product.id}
							product={product}
							category={category!.name}
							editMode={editMode}
						/>
					);
				})}
			</div>
		</div>
	);
};
