import { Images, Products, Vendors } from '@prisma/client';
import React, { FC } from 'react';
import { IProduct } from '../../../../interfaces';
import { showToast } from '../../../../lib/notifications';

interface Props {
	vendor: Vendors;
	product: Products & {
		images: Images[];
	};
	newProduct: IProduct;
	files: File[];
}

export const ButtonEdit: FC<Props> = ({
	newProduct,
	product,
	vendor,
	files
}) => {
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
				.then(async (res) => {
					if (res.status === 200) {
						showToast('success', 'Producto actualizado correctamente');
						if (files.length > 0) {
							const urls = await UploadFiles();
							const images = await concatenateImage(urls, product.id);
						}
					} else showToast('error', 'No se pudo actualizar el producto');
				})
				.catch((err) => {
					console.log(err);
					showToast('error', 'Error al actualizar el producto');
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
		<button
			className='border-2 border-gray-600 rounded w-full md:w-5/12 bg-zinc-800 p-2 shadow'
			onClick={handleUpdateProduct}
		>
			<span className='font-semibold text-white uppercase italic text-lg'>
				Modificar Producto
			</span>
		</button>
	);
};
