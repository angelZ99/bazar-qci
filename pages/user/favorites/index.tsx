import { useContext } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { AuthContext } from '../../../context';
import superjson from 'superjson';
import { ShopLayout } from '../../../components/layouts';
import { ProductList } from '../../../components/products';
import prisma from '../../../lib/prisma';
import { Category, Products } from '@prisma/client';
import { isValidToken } from '../../../lib/jwt';

interface Props {
	categories: Category[];
	products: Products[];
}

const Home: NextPage<Props> = ({ categories, products }) => {
	const { isAuthenticated, user } = useContext(AuthContext);

	return (
		<ShopLayout
			title={'favoritos'}
			pageDescription={'Lista de productos favoritos'}
		>
			{!isAuthenticated ? (
				<h2 className='m-auto text-center text-4xl w-3/4 mt-10 border rounded bg-zinc-800 p-5 text-white'>
					Inicia sesión para poder ver tus productos favoritos{' '}
				</h2>
			) : products.length ? (
				<>
					<h2 className='text-2xl font-semibold mb-5'>
						Tus productos favoritos:
					</h2>
					<ProductList
						products={products}
						currentCategory=''
						categories={categories}
					/>
				</>
			) : (
				<h2 className='text-2xl font-semibold mb-5'>
					No tienes productos favoritos
				</h2>
			)}
		</ShopLayout>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const token = ctx.req.cookies['token'];
	if (token) {
		const { userCode } = await isValidToken(token);
		const categories = await prisma.category.findMany();
		const favorites = await prisma.favorites.findMany({
			where: {
				userCode
			},
			include: {
				product: true
			}
		});
		const products = favorites.map((favorite) => favorite.product);

		return {
			props: {
				categories,
				products: superjson.serialize(products).json
			}
		};
	}
	return {
		props: {
			categories: [],
			products: []
		}
	};
};
