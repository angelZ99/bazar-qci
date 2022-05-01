import { GetServerSideProps, NextPage } from 'next';

import superjson from 'superjson';
import prisma from '../../lib/prisma';
import { ShopLayout } from '../../components/layouts';
import { Category, Products, Vendors } from '@prisma/client';
import { ProductList } from '../../components/products/ProductList';

interface Props {
	products: Products[];
	vendor: Vendors;
	categories: Category[];
}

const Home: NextPage<Props> = ({ products, vendor, categories }) => {
	console.log(products);
	return (
		<ShopLayout
			title={'Inicio'}
			pageDescription={
				'Encuentra lo que busques dentro de tu centro universitario'
			}
		>
			<div className='mb-5'>
				<h2 className='mb-5 flex justify-between flex-wrap m-auto'>
					<span className='text-3xl font-semibold mb-2 m-auto'>
						{vendor.firstName + ' ' + vendor.lastName}
					</span>
					<p className='text-lg'>
						Numero de telefono:
						<span className='font-semibold'> {vendor.phoneNumber}</span>
					</p>
				</h2>
				<p>
					Calificacion del Vendedor:
					<span className='font-bold'> {vendor.rating}</span>
				</p>
			</div>
			<h3 className='text-2xl font-semibold'> Productos: </h3>
			<ProductList
				products={products}
				categories={categories}
				currentCategory=''
			></ProductList>
		</ShopLayout>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { id = 0 } = ctx.query;

	const products = await prisma.products.findMany({
		where: {
			vendorCode: Number(id)
		}
	});

	const vendor = await prisma.vendors.findUnique({
		where: {
			vendorCode: Number(id)
		}
	});

	const categories = await prisma.category.findMany({});

	return {
		props: {
			products: superjson.serialize(products).json,
			vendor: superjson.serialize(vendor).json,
			categories
			//comments: superjson.serialize(comments).json
		}
	};
};
