import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Products, Category } from '@prisma/client';
import superjson from 'superjson';
import prisma from '../../lib/prisma';
import { ShopLayout } from '../../components/layouts';
import { CategoryList } from '../../components/products/categories/CategoryList';

interface Props {
	products: Products;
	categories: Category[];
}

const IndexProductsPage: NextPage<Props> = ({ products, categories }) => {
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
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { category, id } = ctx.query;

	const products = await prisma.products.findMany();
	const categories = await prisma.category.findMany();

	return {
		props: {
			products: superjson.serialize(products),
			categories
		}
	};
};

export default IndexProductsPage;
