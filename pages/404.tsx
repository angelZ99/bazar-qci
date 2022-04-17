import { ShopLayout } from '../components/layouts/ShopLayout';
const Page404 = () => {
	return (
		<ShopLayout title='404' pageDescription='page not found'>
			<h2 className='text-center text-2xl lg:text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full'>
				404 |<br />
				Página no encontrada...
			</h2>
		</ShopLayout>
	);
};

export default Page404;
