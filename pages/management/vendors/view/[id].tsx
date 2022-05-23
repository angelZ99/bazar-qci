import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import superjson from 'superjson';
import prisma from '../../../../lib/prisma';
import {
	Category,
	Comments,
	Images,
	Products,
	RatingProduct,
	Vendors
} from '@prisma/client';
import { IProduct } from '../../../../interfaces';
import { AdminLayout } from '../../../../components/layouts';
import { ImageBuilder } from '../../../../components/products';
import {
	ButtonDelete,
	ButtonAdd,
	ButtonEdit,
	FormProduct
} from '../../../../components/management';

interface Props {
	isEdit: boolean;
	categories: Category[];
	vendor: Vendors;
	product?: Products & {
		images: Images[];
		rating: RatingProduct | null;
	};
	rating?: RatingProduct;
	comments?: Comments;
}

const CrudProduct: NextPage<Props> = ({
	categories,
	isEdit,
	product,
	vendor
}) => {
	const router = useRouter();
	const [newProduct, setNewProduct] = useState<IProduct>({
		name: '',
		description: '',
		price: 0,
		categoryId: 0,
		published: false
	});
	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
		if (!Cookies.get('admin')) {
			router.replace('/management');
		} else {
			const { role } = JSON.parse(Cookies.get('admin') as string);
			if (role !== 'vendor') {
				router.replace('/management');
			}
		}

		if (product) {
			setNewProduct(product);
		}
	}, []);

	const resetState = () => {
		router.reload();
	};

	return (
		<AdminLayout
			title='CRUD'
			pageDescription='product creation or modification page'
			role='vendor'
		>
			<h2 className='text-center text-2xl font-semibold mb-10'>
				{isEdit ? 'Modificando un producto' : 'Nuevo Producto'}{' '}
			</h2>

			<div className='flex flex-col'>
				<ImageBuilder
					files={files}
					isEdit={isEdit}
					setFiles={setFiles}
					vendor={vendor}
				/>
				<FormProduct
					categories={categories}
					newProduct={newProduct}
					setNewProduct={setNewProduct}
					vendor={vendor}
					rating={product?.rating?.rating}
				/>
			</div>
			{isEdit ? (
				<div className='flex flex-wrap gap-5 justify-around'>
					<ButtonEdit
						newProduct={newProduct}
						product={product!}
						vendor={vendor}
						files={files}
					/>
					<ButtonDelete product={product!} />
				</div>
			) : (
				<ButtonAdd
					newProduct={newProduct}
					resetState={resetState}
					vendor={vendor}
					files={files}
				/>
			)}
		</AdminLayout>
	);
};

export default CrudProduct;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { id = 0 } = ctx.query as { id: string };
	const { admin } = ctx.req.cookies;
	const { email } = JSON.parse(admin);

	const vendor = await prisma.vendors.findUnique({
		where: {
			email
		}
	});
	const categories = await prisma.category.findMany();

	if (id === '0') {
		return {
			props: {
				vendor: superjson.serialize(vendor).json,
				categories,
				isEdit: false
			}
		};
	}

	const product = await prisma.products.findUnique({
		where: {
			id: Number(id)
		},
		include: {
			images: true,
			rating: true
		}
	});

	return {
		props: {
			product: superjson.serialize(product).json,
			vendor: superjson.serialize(vendor).json,
			categories,
			isEdit: true
		}
	};
};
