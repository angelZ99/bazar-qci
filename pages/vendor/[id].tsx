import { GetStaticProps, NextPage } from 'next';

import { ShopLayout } from '../../components/layouts';
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
		></ShopLayout>
	);
};

export const getStaticProps: GetStaticProps = async () => {};

export default Home;
