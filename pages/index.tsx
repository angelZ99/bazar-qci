import { GetStaticProps, NextPage } from 'next';

import prisma from '../lib/prisma';
import superjson from 'superjson';
import { ShopLayout } from '../components/layouts';
import { CategoryList } from '../components/products';
import { Category, Products, Vendors } from '@prisma/client';
import Link from 'next/link';

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
			<div className='flex justify-center mt-5'>
				<h2 className='text-2xl'>¿Quieres ser o ya eres un vendedor?</h2>
				<Link href={'/management'}>
					<a className='text-blue-600 font-semibold'>Regístrate aquí</a>
				</Link>
			</div>
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

{
	//TODO:
	//$ create function to get the best sellers and best vendors	 |Sun|
	//$ Create a list of best sellers and best vendors						 |Sun|
	//
	//$ create a visualizer of the multiple images of the products |Fri| ***
	//$ delete and edit the images of the products								 |Sat|
	//
	//$ update comments of the products										 				 |Fri|
	//$ delete comments of the products 													 |Fri|
	//
	//$ admin login 																							 |Sat|
	//$ reports of the products																		 |Sat|
	//$ admin dashboard with the reports of the products					 |Sat|
}
