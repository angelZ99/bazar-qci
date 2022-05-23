import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Products, Category, Images, RatingProduct } from '@prisma/client';
import superjson from 'superjson';
import prisma from '../../lib/prisma';
import { ShopLayout } from '../../components/layouts';
import { CategoryList } from '../../components/products/categories/CategoryList';
import { ProductList } from '../../components/products/ProductList';

interface Props {
	products: (Products & {
		images: Images[];
		rating: RatingProduct | null;
	})[];
	categories: Category[];
}

const IndexProductsPage: NextPage<Props> = ({ products, categories }) => {
	const router = useRouter();
	const { category, id } = router.query;

	return (
		<ShopLayout
			title='Productos'
			pageDescription='Listado de productos mas comprados'
		>
			<CategoryList
				categories={categories}
				currentCategory={category as string}
			/>
			<div className='flex flex-col mt-10'>
				<h3 className='text-2xl font-semibold'>
					Ultimos 20 productos agregados:
				</h3>
				<ProductList
					categories={categories}
					currentCategory=''
					products={products}
				/>
			</div>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { category, id } = ctx.query;

	const products = await prisma.products.findMany({
		take: 20,
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			images: true,
			rating: true
		}
	});
	const categories = await prisma.category.findMany();

	return {
		props: {
			products: superjson.serialize(products).json,
			categories
		}
	};
};

export default IndexProductsPage;
