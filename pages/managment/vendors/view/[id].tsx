import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import superjson from 'superjson';
import prisma from '../../../../lib/prisma';
import {
	Category,
	Comments,
	Products,
	RatingProduct,
	Vendors
} from '@prisma/client';
import { AdminLayout } from '../../../../components/layouts';
import { IAdmin, IProduct } from '../../../../interfaces';
import Cookies from 'js-cookie';
import { showToast } from '../../../../lib/notifications';

interface Props {
	isEdit: boolean;
	categories: Category[];
	vendor: Vendors;
	product?: Products;
	rating?: RatingProduct;
	comments?: Comments;
}

const editProduct: NextPage<Props> = ({
	categories,
	isEdit,
	product,
	vendor
}) => {
	const router = useRouter();

	useEffect(() => {
		if (!Cookies.get('admin')) {
			router.replace('/managment');
		} else {
			const { role } = JSON.parse(Cookies.get('admin') as string);
			if (role !== 'vendor') {
				router.replace('/managment');
			}
		}

		if (product) {
			setNewProduct(product);
		} else {
			router.replace('/managment/vendors/home');
		}
	}, []);

	const [newProduct, setNewProduct] = useState<IProduct>({
		name: '',
		description: '',
		price: 0,
		categoryId: 0,
		published: false
	});

	const { firstName, lastName } = vendor;

	const validations = () => {
		if (newProduct.name.length < 3) {
			showToast(
				'error',
				'El nombre del producto debe tener al menos 3 caracteres'
			);
			return false;
		}
		if (newProduct.description.length < 10) {
			showToast(
				'error',
				'La descripción del producto debe tener al menos 10 caracteres'
			);
			return false;
		}
		if (newProduct.price <= 0) {
			showToast('error', 'El precio del producto debe ser mayor a 0');
			return false;
		}
		if (newProduct.categoryId === 0) {
			showToast('error', 'Debe seleccionar una categoría');
			return false;
		}
		return true;
	};

	const handleAddProduct = async () => {
		if (validations()) {
			const product = await fetch('/api/products/product', {
				method: 'POST',
				body: JSON.stringify({
					name: newProduct.name,
					description: newProduct.description,
					price: newProduct.price,
					categoryId: newProduct.categoryId,
					vendorCode: vendor.vendorCode
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => res.json());
			showToast('success', 'Producto agregado correctamente');
			resetState();
		}
	};

	const handleUpdateProduct = async () => {
		if (validations()) {
			await fetch('/api/products/product', {
				method: 'PUT',
				body: JSON.stringify({
					id: product!.id,
					name: newProduct.name,
					description: newProduct.description,
					price: newProduct.price,
					published: newProduct.published,
					categoryId: newProduct.categoryId,
					vendorCode: vendor.vendorCode
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					if (res.status === 200)
						showToast('success', 'Producto actualizado correctamente');
					else showToast('error', 'No se pudo actualizar el producto');
				})
				.catch((err) => {
					showToast('error', 'Error al actualizar el producto');
				});
		}
	};

	const handleDeleteProduct = async () => {
		const { id } = product!;

		await fetch('/api/products/product', {
			method: 'DELETE',
			body: JSON.stringify({ id }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				console.log(res);
				if (res.status === 200) {
					showToast('success', 'Producto eliminado correctamente');
					router.replace('/managment/vendors/home');
				} else showToast('error', 'No se pudo eliminar el producto');
			})
			.catch((err) => {
				showToast('error', 'Error al eliminar el producto');
			});
	};

	const resetState = () => {
		setNewProduct({
			name: '',
			description: '',
			price: 0,
			categoryId: 0,
			published: false
		});
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
			<div className='flex mb-3'>
				{/***** Header Product *****/}
				<button className='border-2 w-[120px] h-[120px]'></button>
				<div className='ml-0'>
					<input
						className='text-lg font-semibold mb-3 border ml-5 mt-1 p-1 pl-2'
						placeholder='Nombre del Producto...'
						value={newProduct.name}
						onChange={(e) => {
							setNewProduct({ ...newProduct, name: e.target.value });
						}}
					/>
					{/**********/}
					<div className='flex flex-col md:flex-row md:flex-wrap gap-3 justify-around items ml-5 text-base'>
						{/* Price */}
						<div>
							Precio:
							<input
								type='number'
								className='font-semibold border mt-1 pl-2 w-full h-[30px]'
								placeholder='Precio del producto'
								value={newProduct.price}
								onChange={(e) => {
									setNewProduct({
										...newProduct,
										price: parseInt(e.target.value)
									});
								}}
							/>
						</div>
						{/* Category */}
						<div>
							Categoría:
							<select
								className='font-semibold border mt-1 pl-2 w-full h-[30px]'
								value={newProduct.categoryId}
								onChange={(e) => {
									setNewProduct({
										...newProduct,
										categoryId: parseInt(e.target.value)
									});
								}}
							>
								{categories.map((category) => {
									return (
										<option key={category.id} value={category.id}>
											{category.name}
										</option>
									);
								})}
							</select>
						</div>
						{/* Rating */}
						<div className='w-full'>Calificacion: - </div>
						{/* Vendor */}
						<div className='w-full'>
							Vendedor: <br />
							<span className='ml-5 text-blue-700 italic font-semibold'>
								{firstName} {lastName}
							</span>
						</div>
					</div>
				</div>
			</div>
			{/***** Description Product *****/}
			<div className='mb-5'>
				<h3 className='text-lg font-semibold'> Descripcion: </h3>
				<textarea
					className='border w-full p-2'
					rows={5}
					value={newProduct.description}
					onChange={(e) => {
						setNewProduct({ ...newProduct, description: e.target.value });
					}}
				></textarea>
			</div>
			{isEdit ? (
				<div className='flex flex-wrap gap-5 justify-around'>
					<button
						className='border-2 border-gray-600 rounded w-full md:w-5/12 bg-zinc-800 p-2 shadow'
						onClick={handleUpdateProduct}
					>
						<span className='font-semibold text-white uppercase italic text-lg'>
							Modificar Producto
						</span>
					</button>
					<button
						className='border-2 border-red-400 rounded w-full md:w-5/12 bg-red-900 p-2 shadow'
						onClick={handleDeleteProduct}
					>
						<span className='font-semibold text-white uppercase italic text-lg'>
							Eliminar Producto
						</span>
					</button>
				</div>
			) : (
				<div className='flex justify-center mb-8'>
					<button
						className='border-2 border-blue-400 rounded w-full bg-blue-900 p-2 shadow'
						onClick={handleAddProduct}
					>
						<span className='font-semibold text-white uppercase italic text-lg'>
							Agregar Producto
						</span>
					</button>
				</div>
			)}
		</AdminLayout>
	);
};

export default editProduct;

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
