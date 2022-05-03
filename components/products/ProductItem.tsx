import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Products } from '@prisma/client';

interface Props {
	product: Products;
	category: string;
	editMode?: boolean;
}

export const ProductItem: FC<Props> = ({ product, category, editMode }) => {
	return (
		<Link
			href={{
				pathname: `${
					editMode ? '/managment/vendors/view/[id]' : '/products/view/[id]'
				}`,
				query: { id: product.id, name: product.name }
			}}
		>
			<a className='flex flex-col border rounded-xl min-h-[250px] w-[47%] md:w-[32%] xl:w-[23%] p-3 justify-between mb-5 z-0'>
				<h4 className='text-center font-semibold mb-2'>{product.name}</h4>
				<div className='flex justify-around flex-wrap'>
					<div className='flex'>
						<Image
							src='/img/money.png'
							width={20}
							height={20}
							alt='Image money'
						/>
						<span className='ml-1 text-sm'>{product.price}</span>
					</div>
					<div className='flex'>
						<Image
							src='/img/star.png'
							width={20}
							height={20}
							alt='Image money'
						/>
						<span className='ml-1 text-sm'> 4.1 </span>
					</div>
					<p className='text-xs text-ellipsis whitespace-nowrap overflow-hidden text-center'>
						Categoria: <span className='font-semibold'>{category}</span>
					</p>
				</div>
			</a>
		</Link>
	);
};
