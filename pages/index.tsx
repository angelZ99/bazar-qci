import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';

const Home: NextPage = () => {
	return (
		<ShopLayout
			title={'Inicio'}
			pageDescription={
				'Encuentra lo que busques dentro de tu centro universitario'
			}
		>
			<h1>Home</h1>
		</ShopLayout>
	);
};

export default Home;
