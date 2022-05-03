import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookies from 'js-cookie';

import {
	LoginVendor,
	LoginAdmin,
	SignupVendor
} from '../../components/managment';
import { IAdmin } from '../../interfaces';

const IndexProductsPage: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		if (Cookies.get('admin')) {
			const { role } = JSON.parse(Cookies.get('admin') as string);
			if (role === 'admin') {
				router.push('/managment/admin');
			} else if (role === 'vendor') {
				router.push('/managment/vendors/home');
			}
		}
	}, []);

	const [admin, setAdmin] = useState(false);
	const [toRegister, setToRegister] = useState(false);

	const active = 'border-b-4 border-orange-500';
	const notActive = 'border-b-2 border-gray-500';
	return (
		<>
			<Head>
				<title>BazarQci - Administración</title>
			</Head>
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
				{admin ? (
					<LoginAdmin />
				) : toRegister ? (
					<SignupVendor setToRegister={setToRegister} />
				) : (
					<LoginVendor setToRegister={setToRegister} />
				)}
			</div>
		</>
	);
};

export default IndexProductsPage;
