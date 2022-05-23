import React, { FC } from 'react';
import { IProduct } from '../../../../interfaces';
import { Vendors } from '@prisma/client';
import { showToast, spinnerModal } from '../../../../lib/notifications';

interface Props {
	vendor: Vendors;
	newProduct: IProduct;
	resetState: () => void;
	files: File[];
}

export const ButtonAdd: FC<Props> = ({
	files,
	newProduct,
	resetState,
	vendor
}) => {
	const handleAddProduct = async () => {
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
			if (files.length === 0) {
				showToast('error', 'Debe subir al menos una imagen');
				return false;
			}

			return true;
		};

		if (validations()) {
			spinnerModal(false);

			await fetch('/api/products/product', {
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
			})
				.then(async (res) => {
					const { product } = await res.json();
					const urls = await UploadFiles();
					const images = await concatenateImage(urls, product.id);
					spinnerModal(true);
					showToast('success', 'Producto agregado correctamente');
				})
				.catch((err) => {
					showToast('error', 'Error al agregar el producto');
				});
		}
	};

	const UploadFiles = async () => {
		const data = await Promise.all(
			files.map(async (file) => {
				const data = new FormData();
				data.append('file', file);
				data.append('upload_preset', 'bazar-qci');
				return await fetch(
					'https://api.cloudinary.com/v1_1/dxbxkrj9e/image/upload',
					{
						method: 'POST',
						body: data
					}
				)
					.then((res) => res.json())
					.catch((err) => console.log(err));
			})
		);
		const urls = data.map((img) => img.secure_url as string);

		return urls;
	};

	const concatenateImage = async (urls: string[], productId: number) => {
		const Image = await fetch('/api/products/images', {
			method: 'POST',
			body: JSON.stringify({
				urls,
				productId
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json())
			.catch((err) => console.log(err));
		return Image;
	};

	return (
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
	);
};
