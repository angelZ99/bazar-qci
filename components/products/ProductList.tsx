import { Category, Products } from '@prisma/client';
import { FC } from 'react';
import { ProductItem } from './';

interface Props {
	products: Products[];
	categories: Category[];
	currentCategory: string;
}

export const ProductList: FC<Props> = ({
	products,
	categories,
	currentCategory
}) => {
	return (
		<div className='mt-5'>
			<h3 className='text-2xl mb-3'>
				Productos de: <span className='font-bold'> {currentCategory} </span>
			</h3>
			<div className='flex flex-wrap gap-3'>
				{products.map((product) => (
					<ProductItem
						key={product.id}
						product={product}
						category={categories[product.categoryId].name}
					/>
				))}
			</div>
		</div>
	);
};
