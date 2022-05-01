import { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { LoginVendor, LoginAdmin } from '../../components/managment';

const IndexProductsPage: NextPage = () => {
	const [admin, setAdmin] = useState(false);

	const active = 'border-b-4 border-orange-500';
	const notActive = 'border-b-2 border-gray-500';
	return (
		<>
			<div className='flex justify-between'>
				<button
					className={`border w-full p-5 text-xl ${!admin ? active : notActive}`}
					onClick={() => {
						setAdmin(false);
					}}
				>
					Vendedores
				</button>
				<button
					className={`border w-full p-5 text-xl ${admin ? active : notActive}`}
					onClick={() => {
						setAdmin(true);
					}}
				>
					Administrador
				</button>
			</div>
			<Link href={'/'}>
				<a className='flex flex-row-reverse mt-3 mr-2 text-xs italic text-blue-800 underline'>
					Regresar a la pagina principal
				</a>
			</Link>
			<div className='container m-auto'>
				{admin ? <LoginAdmin /> : <LoginVendor />}
			</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	return {
		props: {}
	};
};

export default IndexProductsPage;
