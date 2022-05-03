import { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import prisma from '../../../lib/prisma';
import superjson from 'superjson';
import Cookies from 'js-cookie';
import { Products, Vendors, Category } from '.prisma/client';
import { AdminLayout } from '../../../components/layouts';
import { ProductList } from '../../../components/products/ProductList';
import Link from 'next/link';

interface Props {
	allData: Vendors & {
		products: Products[];
	};
	categories: Category[];
}

const index: NextPage<Props> = ({ allData, categories }) => {
	const router = useRouter();

	const { products } = allData;

	useEffect(() => {
		if (!Cookies.get('admin')) {
			router.replace('/managment');
		} else {
			const { role } = JSON.parse(Cookies.get('admin') as string);
			if (role !== 'vendor') {
				router.replace('/managment');
			}
		}
	}, []);

	return (
		<AdminLayout
			title='Administracion vendedores'
			pageDescription='Administracion vendedores'
			role='vendor'
		>
			<div className='flex flex-col mb-5'>
				<h1 className='text-xl font-bold mb-5 m-auto'>
					Administración - Vendedores
				</h1>
				<div>
					{/* Name of vendor*/}
					<h2 className='flex flex-col text-lg items-baseline font-semibold'>
						Nombre del vendedor:
						<span className='ml-3 text-base font-normal text-ellipsis whitespace-nowrap overflow-hidden'>
							{allData.firstName} {allData.lastName}
						</span>
					</h2>
					{/* Email of vendor*/}
					<h2 className='flex flex-col text-lg items-baseline font-semibold'>
						Email del vendedor:
						<span className='ml-3 text-base font-normal text-ellipsis whitespace-nowrap overflow-hidden'>
							{allData.email}
						</span>
					</h2>
				</div>
			</div>

			<h3 className='text-2xl font-semibold'> Productos: </h3>

			<div className='flex mt-5'>
				<Link
					href={{
						pathname: '/managment/vendors/view/[id]',
						query: { id: 0, name: '' }
					}}
				>
					<a className='flex flex-col border rounded-xl min-h-[250px] w-[47%] md:w-[32%] xl:w-[23%] p-3 justify-between mb-5 z-0'>
						<h4 className='text-center font-semibold mb-2'>
							Agregar un producto
						</h4>
						<p className='text-center text-9xl'>+</p>
						<p></p>
					</a>
				</Link>
			</div>

			<ProductList
				categories={categories}
				products={products}
				currentCategory=''
				editMode={true}
			/>
		</AdminLayout>
	);
};

export default index;

//* Get all data from prisma and return it to props
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { admin } = ctx.req.cookies;
	const { email } = JSON.parse(admin);

	const vendor = await prisma.vendors.findUnique({
		where: {
			email: email
		},
		include: {
			products: true
		}
	});

	const categories = await prisma.category.findMany();

	return {
		props: {
			categories,
			allData: superjson.serialize(vendor).json
		}
	};
};
