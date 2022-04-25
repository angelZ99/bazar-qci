import { GetStaticProps, NextPage } from 'next';

import prisma from '../lib/prisma';
import superjson from 'superjson';
import { ShopLayout } from '../components/layouts';
import { CategoryList } from '../components/products';
import { Category, Products, Vendors } from '@prisma/client';

interface Props {
	categories: Category[];
	products: Products[];
	vendors: Vendors[];
}

const Home: NextPage<Props> = ({ categories, products, vendors }) => {
	return (
		<ShopLayout
			title={'Inicio'}
			pageDescription={
				'Encuentra lo que busques dentro de tu centro universitario'
			}
		>
			<CategoryList categories={categories} />
			{
				// TODO: Implement a list of best sellers and best vendors
				//<BestSellers products={products} />}
				//<BestVendors vendors={vendors} />
			}
		</ShopLayout>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const categories = await prisma.category.findMany();
	const products = await prisma.products.findMany();
	const vendors = await prisma.vendors.findMany();

	prisma.$disconnect();

	return {
		props: {
			categories,
			products: superjson.serialize(products),
			vendors: superjson.serialize(vendors)
		},
		revalidate: 600
	};
};

export default Home;
