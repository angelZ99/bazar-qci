import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Products, Category, Images } from '@prisma/client';
import superjson from 'superjson';
import prisma from '../../lib/prisma';
import { ShopLayout } from '../../components/layouts';
import { CategoryList, ProductList } from '../../components/products/';

interface Props {
	products: (Products & {
		images: Images[];
	})[];
	categories: Category[];
}

const CategoryPage: NextPage<Props> = ({ products, categories }) => {
	const router = useRouter();
	const { category, id } = router.query;

	return (
		<ShopLayout
			title='Productos'
			pageDescription='Listado de productos por categoria'
		>
			<CategoryList
				categories={categories}
				currentCategory={category as string}
			/>
			<ProductList
				categories={categories}
				currentCategory={category as string}
				products={products}
			/>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { category, id } = ctx.query;

	if (!id) {
		return {
			redirect: {
				permanent: true,
				destination: '/404'
			}
		};
	}

	const categories = await prisma.category.findMany({});
	const products = await prisma.products.findMany({
		where: {
			categoryId: parseInt(id as string)
		},
		include: {
			images: true
		}
	});

	return {
		props: {
			products: superjson.serialize(products).json,
			categories
		}
	};
};

export default CategoryPage;
