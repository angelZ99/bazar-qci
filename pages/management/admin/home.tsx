import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Cookies from 'js-cookie';
import prisma from '../../../lib/prisma';
import superjson from 'superjson';
import { AdminLayout } from '../../../components/layouts';
import { Images, Products, Reports } from '@prisma/client';
import { showToast } from '../../../lib/notifications';

interface Props {
	reports: (Reports & {
		product: Products & {
			images: Images[];
		};
	})[];
}

const Home: NextPage<Props> = ({ reports }) => {
	const router = useRouter();
	useEffect(() => {
		if (!Cookies.get('admin')) {
			router.replace('/management');
		} else {
			const { role } = JSON.parse(Cookies.get('admin') as string);
			if (role !== 'admin') {
				router.replace('/management');
			}
		}
	}, []);

	const handleDelete = async (productId: number) => {
		await fetch('/api/products/product', {
			method: 'DELETE',
			body: JSON.stringify({ id: productId }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				if (res.status === 200) {
					showToast('success', 'Producto eliminado correctamente');
					router.reload();
				} else showToast('error', 'No se pudo eliminar el producto');
			})
			.catch((err) => {
				showToast('error', 'Error al eliminar el producto');
			});
	};

	const handleCancel = async (productId: number) => {
		const report = await fetch(`/api/products/reports`, {
			method: 'DELETE',
			body: JSON.stringify({ productId }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.catch((err) => showToast('error', 'Error al cancelar reporte'));
		if (report) {
			showToast('success', 'Reporte cancelado');
			router.reload();
		}
	};

	return (
		<AdminLayout
			title='Administracion'
			pageDescription='Administracion'
			role='admin'
		>
			<div className='flex flex-col mb-5'>
				<h1 className='text-xl font-bold mb-5 m-auto'>Administración</h1>
			</div>

			<h3 className='text-2xl font-semibold'> Reportes: </h3>
			<div className='flex flex-wrap gap-5 mb-5'>
				{reports.map((report) => (
					<div
						key={report.id}
						className='flex flex-col mb-5 border rounded-lg p-2 w-full md:w-1/3 lg:w-1/4'
					>
						<Image
							src={report.product.images[0].url}
							width={120}
							height={120}
							alt='product'
						></Image>
						<h2 className='flex flex-col text-lg items-baseline font-semibold'>
							Producto:
							<span className='ml-3 text-base font-normal text-ellipsis whitespace-nowrap overflow-hidden'>
								{report.product.name}
							</span>
						</h2>
						<div className='flex flex-wrap mb-5'>
							<span className='font-semibold'>Motivo: </span>
							<span className='ml-3 text-base font-normal'>
								{report.description}
							</span>
						</div>
						<div className='flex justify-evenly'>
							<button
								className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded-lg flex'
								onClick={() => {
									handleCancel(report.product.id);
								}}
							>
								Cancelar reporte
							</button>
							<button
								className='bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-1 rounded-lg flex'
								onClick={() => {
									handleDelete(report.product.id);
								}}
							>
								Eliminar producto
							</button>
						</div>
					</div>
				))}
			</div>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { admin } = ctx.req.cookies;

	if (!admin) {
		return {
			redirect: {
				permanent: true,
				destination: '/management/'
			}
		};
	}

	const reports = await prisma.reports.findMany({
		include: {
			product: {
				include: {
					images: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		props: {
			reports: superjson.serialize(reports).json
		}
	};
};

export default Home;
