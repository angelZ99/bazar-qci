import React, { FC } from 'react';
import { Images, Products } from '@prisma/client';
import { showToast } from '../../../../lib/notifications';
import { useRouter } from 'next/router';

interface Props {
	product: Products & {
		images: Images[];
	};
}

export const ButtonDelete: FC<Props> = ({ product }) => {
	const router = useRouter();
	const handleDeleteProduct = async () => {
		const { id } = product;

		await fetch('/api/products/product', {
			method: 'DELETE',
			body: JSON.stringify({ id }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				if (res.status === 200) {
					showToast('success', 'Producto eliminado correctamente');
					router.replace('/management/vendors/home');
				} else showToast('error', 'No se pudo eliminar el producto');
			})
			.catch((err) => {
				showToast('error', 'Error al eliminar el producto');
			});
	};

	return (
		<button
			className='border-2 border-red-400 rounded w-full md:w-5/12 bg-red-900 p-2 shadow'
			onClick={handleDeleteProduct}
		>
			<span className='font-semibold text-white uppercase italic text-lg'>
				Eliminar Producto
			</span>
		</button>
	);
};
