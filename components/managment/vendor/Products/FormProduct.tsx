import React, { FC } from 'react';
import { Category, Images, Products, Vendors } from '@prisma/client';
import { IProduct } from '../../../../interfaces';

interface Props {
	categories: Category[];
	vendor: Vendors;
	newProduct: IProduct;
	setNewProduct: (newProduct: IProduct) => void;
}

export const FormProduct: FC<Props> = ({
	categories,
	setNewProduct,
	newProduct,
	vendor
}) => {
	const { firstName, lastName } = vendor;

	return (
		<>
			<div className='ml-0'>
				<label htmlFor=''> Nombre del Producto: </label>
				<input
					className='text-lg font-semibold mb-3 border  mt-1 p-1 pl-2'
					placeholder='Nombre del Producto...'
					value={newProduct.name}
					onChange={(e) => {
						setNewProduct({ ...newProduct, name: e.target.value });
					}}
				/>
				{/**********/}
				<div className='flex flex-col md:flex-row md:flex-wrap gap-3 justify-around items  text-base'>
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
						<span className=' text-blue-700 italic font-semibold'>
							{firstName} {lastName}
						</span>
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
		</>
	);
};
