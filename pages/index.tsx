import { NextPage, GetServerSideProps } from 'next';

import prisma from '../lib/prisma';
import superjson from 'superjson';
import { ShopLayout } from '../components/layouts';
import { CategoryList, ProductList } from '../components/products';
import {
	Category,
	Images,
	Products,
	RatingProduct,
	Vendors
} from '@prisma/client';
import Link from 'next/link';

interface Props {
	categories: Category[];
	lastProducts: (Products & {
		images: Images[];
		rating: RatingProduct | null;
	})[];
	moreCommented: (Products & {
		images: Images[];
		rating: RatingProduct | null;
	})[];
	bestRated: (Products & {
		images: Images[];
		rating: RatingProduct | null;
	})[];
}

const Home: NextPage<Props> = ({
	categories,
	bestRated,
	lastProducts,
	moreCommented
}) => {
	console.log(moreCommented);
	console.log(bestRated);

	return (
		<ShopLayout
			title={'Inicio'}
			pageDescription={
				'Encuentra lo que busques dentro de tu centro universitario'
			}
		>
			<CategoryList categories={categories} />

			<div className='flex flex-col mt-10'>
				<h3 className='text-2xl font-semibold'>Productos mas nuevos:</h3>
				<ProductList
					categories={categories}
					currentCategory=''
					products={lastProducts}
				/>
			</div>
			<div className='flex flex-col mt-10'>
				<h3 className='text-2xl font-semibold'>Productos mas comentados:</h3>
				<ProductList
					categories={categories}
					currentCategory=''
					products={moreCommented}
				/>
			</div>
			<div className='flex flex-col mt-10'>
				<h3 className='text-2xl font-semibold'>Productos mejor valorados:</h3>
				<ProductList
					categories={categories}
					currentCategory=''
					products={bestRated}
				/>
			</div>

			<div className='flex flex-col items-center mt-5 border-2 border-black border-dashed p-5'>
				<h2 className='text-2xl text-center mb-1'>
					¿Quieres ser o ya eres un vendedor?
				</h2>
				<Link href={'/management'}>
					<a className='text-blue-600 font-semibold text-xl'>Entra aqui</a>
				</Link>
			</div>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const last20Products = await prisma.products.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			images: true,
			rating: true
		},
		take: 10
	});
	const moreCommented = await prisma.products.findMany({
		take: 10,
		orderBy: {
			comments: {
				_count: 'desc'
			}
		},
		include: {
			images: true,
			rating: true
		}
	});
	const bestRated = await prisma.products.findMany({
		take: 10,
		orderBy: {
			rating: {
				rating: 'desc'
			}
		},
		include: {
			images: true,
			rating: true
		}
	});
	const categories = await prisma.category.findMany();

	return {
		props: {
			lastProducts: superjson.serialize(last20Products).json,
			moreCommented: superjson.serialize(moreCommented).json,
			bestRated: superjson.serialize(bestRated).json,
			categories
		}
	};
};

export default Home;
