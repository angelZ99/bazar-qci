import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import superjson from 'superjson';
import prisma from '../../../lib/prisma';
import { Products, Vendors } from '@prisma/client';
import { ShopLayout } from '../../../components/layouts';

interface Props {
	product: Products;
	vendor: Vendors;
}

const IndexProductsPage: NextPage<Props> = ({ product, vendor }) => {
	const router = useRouter();

	return (
		<ShopLayout title={product.name} pageDescription={product.description}>
			<div>
				<div className='flex mb-3'>
					<Image src='/img/food.png' width={120} height={120} />
					{/***** Header Product *****/}
					<div className='ml-5'>
						<h2 className='text-xl font-semibold mb-3'>{product.name}</h2>
						{/**********/}
						<div className='ml-5 text-lg'>
							{/* Price */}
							<div>
								Precio:
								<span className='font-semibold'> {product.price} </span>
							</div>
							{/* Rating */}
							<div>
								Calificacion:
								<span className='font-semibold'> -- </span>
							</div>
							{/* Vendor */}
							<div>
								Vendedor: <br />
								<Link href='/'>
									<span className='flex justify-center text-blue-700 italic font-semibold'>
										{vendor.firstName} {vendor.lastName}
									</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
				{/***** Description Product *****/}
				<div className='mb-5'>
					<h3 className='text-lg font-semibold'> Descripcion: </h3>
					<p>{product.description}</p>
				</div>
				{/***** Fav Product *****/}
				<div className='flex justify-end mb-5'>
					<button className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-1 rounded-lg flex gap-3'>
						Agregar a Favoritos
						<Image src='/img/white-favorite.png' width={24} height={24} />
					</button>
				</div>
				<div className='flex justify-center mb-8'>
					<button className='border-2 border-gray-600 rounded w-full bg-zinc-800 p-2 shadow'>
						<span className='font-semibold text-white uppercase italic text-lg'>
							Contactar al vendedor
						</span>
					</button>
				</div>
				<div className='flex justify-between mb-5'>
					<h3 className='text-lg font-semibold'> Comentarios: </h3>
					<button className='italic text-blue-700 font-semibold'>
						Hacer un comentario
					</button>
				</div>
			</div>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { id } = ctx.query;

	const product = await prisma.products.findUnique({
		where: {
			id: Number(id)
		}
	});

	if (!product) {
		return {
			redirect: {
				permanent: true,
				destination: '/404'
			}
		};
	}

	const vendor = await prisma.vendors.findUnique({
		where: {
			vendorCode: product.vendorCode
		}
	});

	return {
		props: {
			product: superjson.serialize(product).json,
			vendor: superjson.serialize(vendor).json
		}
	};
};

export default IndexProductsPage;
